import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, forkJoin, map, mergeMap } from 'rxjs';
import { Inscripcion } from '../models/inscripcion';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
import { CursoService } from './curso.service';
import { AlumnoService } from './alumno.service';
import { Curso } from '../models/curso';
import { Alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private readonly url: string = environment.url + "/inscripciones";
  private inscripciones!: BehaviorSubject<Inscripcion[]>;

  constructor(private http: HttpClient, private cursoService: CursoService, private alumnoService: AlumnoService) {
    this.inscripciones = new BehaviorSubject<Inscripcion[]>([]);
  }

  obtenerInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<any[]>(this.url).pipe(
      mergeMap((inscripciones: any[]) => {
        // Fetch courses and students
        const cursos$: Observable<Curso[]> = this.cursoService.obtenerCursos();
        const alumnos$: Observable<Alumno[]> = this.alumnoService.obtenerAlumnos();

        return forkJoin([cursos$, alumnos$]).pipe(
          map(([cursos, alumnos]) => {
            const cursoMap: Map<number, Curso> = new Map(cursos.map(curso => [curso.id, curso]));
            const alumnoMap: Map<number, Alumno> = new Map(alumnos.map(alumno => [alumno.id, alumno]));
            // Map the inscripciones with the retrieved courses and students
            return inscripciones.map(inscripcion => new Inscripcion(
              inscripcion.id,
              cursoMap.get(inscripcion.idCurso)!,
              alumnoMap.get(inscripcion.idAlumno)!
            ));
          })
        );
      })
    );
  }

  obtenerInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[] | undefined> {
    return this.http.get<Inscripcion[]>(this.url + '?idCurso=' + cursoId);
  }

  obtenerInscripcion(inscripcionId: number): Observable<Inscripcion | undefined> {
    return this.http.get<Inscripcion>(this.url + '/' + inscripcionId);
  }

  obtenerInscripcionPorCursoAlumno(curso: Curso, alumno: Alumno): Observable<Inscripcion | undefined> {
    return this.http.get<any[]>(`${this.url}?idCurso=${curso.id}&idAlumno=${alumno.id}`)
      .pipe(
        map(inscripcion => new Inscripcion(inscripcion[0].id, curso, alumno)
        )
      );
  }

  // obtenerAlumno(inscripcion: Inscripcion): Observable<Alumno | undefined> {
  //   return this.alumnoService.obtenerAlumno(inscripcion.idAlumno);
  // }

  // obtenerCurso(inscripcion: Inscripcion): Observable<Curso | undefined> {
  //   return this.cursoService.obtenerCurso(inscripcion.idCurso);
  // }

  altaInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const inscripcionData = {
      idCurso: inscripcion.curso.id,
      idAlumno: inscripcion.alumno.id
    };

    return this.http.post<any>(this.url, inscripcionData);
  }

  modificarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const inscripcionData = {
      id: inscripcion.id,
      idCurso: inscripcion.curso.id,
      idAlumno: inscripcion.alumno.id
    };

    return this.http.put<Inscripcion>(this.url + '/' + inscripcion.id, inscripcionData);
  }

  eliminarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.delete<Inscripcion>(this.url + '/' + inscripcion.id)
      .pipe(
        map(() => inscripcion)
      );
  }

  // eliminarInscripciones(alumnoId: number): Observable<Inscripcion[]> {
  //   return this.http.get<Inscripcion[]>(this.url + '?idAlumno=' + alumnoId)
  //     .pipe(
  //       map((inscripciones) => {
  //         inscripciones.forEach((inscripcion) => this.http.delete<Inscripcion>(this.url + '/' + inscripcion.id).subscribe());
  //         return inscripciones;
  //       })
  //     );
  // }

}

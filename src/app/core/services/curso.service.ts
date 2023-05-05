import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, mergeMap, Observable, switchMap } from 'rxjs';
import { Curso } from '../models/curso';
import { Inscripcion } from '../models/inscripcion';
import { Alumno } from '../models/alumno';
import { Profesor } from '../models/profesor';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
import { ProfesorService } from './profesor.service';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private readonly url: string = environment.url + "/cursos";
  private cursos: BehaviorSubject<Curso[]>;

  constructor(private http: HttpClient, private profesorService: ProfesorService) {
    this.cursos = new BehaviorSubject<Curso[]>([]);
  }

  obtenerCursos(): Observable<Curso[]> {

    return this.http.get<any[]>(this.url).
      pipe(
        mergeMap((cursos: any[]) => {
          const observables = cursos.map((curso: any) =>
            forkJoin([
              this.profesorService.obtenerProfesor(curso.idProfesor), // obtengo Profesor
              this.obtenerAlumnos(curso.id) // obtengo sus Alumnos
            ])
              .pipe(
                map(([profesor, alumnos]) => new Curso(curso.id, curso.materia, profesor, alumnos))
              )
          );

          return forkJoin(observables);
        })
      );
  }

  obtenerCurso(cursoId: number): Observable<Curso> {
    return this.http.get<any>(this.url + '/' + cursoId).pipe(
      mergeMap((curso: any) =>
        forkJoin([
          this.profesorService.obtenerProfesor(curso.idProfesor),
          this.obtenerAlumnos(curso.id)
        ]).pipe(
          map(([profesor, alumnos]) => new Curso(curso.id, curso.materia, profesor, alumnos))
        )
      )
    );
  }

  eliminarCurso(curso: Curso): Observable<Curso> {
    return this.http.delete<Curso>(this.url + '/' + curso.id)
      .pipe(
        map(() => curso)
      );
  }

  altaCurso(curso: Curso): Observable<Curso> {

    const cursoData = {
      id: curso.id,
      materia: curso.materia,
      idProfesor: curso.profesor ? curso.profesor.id : undefined
    };

    return this.getUltimoId().
      pipe(
        map((id) => {
          cursoData.id = id + 1;
          return cursoData;
        }),
        switchMap((c) => {
          return this.http.post<Curso>(this.url, c);
        })
      );
  }

  modificarCurso(curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(this.url + '/' + curso.id, curso);
  }

  obtenerAlumnos(cursoId: number): Observable<Alumno[] | undefined> {
    return this.http.get<any[]>(`http://localhost:3000/inscripciones?idCurso=${cursoId}`)
      .pipe(
        switchMap(inscripciones =>
          forkJoin(
            inscripciones.map(inscripcion => this.http.get<Alumno>(`http://localhost:3000/alumnos/${inscripcion.idAlumno}`))
          )
        )
      );
  }

  obtenerProfesor(profesorId: number | undefined): Observable<Profesor | undefined> {
    return this.http.get<Profesor>("http://localhost:3000/profesores" + '/' + profesorId);
  }

  bajaAlumnoCurso(cursoId: number, alumnoId: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>("http://localhost:3000/inscripciones" + '?idCurso=' + cursoId + '&idAlumno=' + alumnoId).pipe(
      switchMap(
        (inscripcion) => this.http.delete<Inscripcion>("http://localhost:3000/inscripciones" + '/' + inscripcion.id)
      )
    );
  }

  bajaProfesorCurso(curso: Curso): Observable<Curso> {
    curso.profesor = undefined;
    return this.http.put<Curso>(this.url + '/' + curso.id, curso);
  }

  private getUltimoId(): Observable<number> {
    return this.http.get<any[]>(this.url)
      .pipe(
        map(cursos => {
          let ultimoId = 0;
          cursos.forEach(curso => {
            if (curso.id > ultimoId) {
              ultimoId = curso.id;
            }
          });
          return ultimoId;
        })
      );
  }

}

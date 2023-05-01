import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Curso } from '../models/curso';
import { alumnosData, cursosData, inscripcionesData } from '../data';
import { Inscripcion } from '../models/inscripcion';
import { Alumno } from '../models/alumno';
import { AlumnoService } from './alumno.service';
import { ProfesorService } from './profesor.service';
import { InscripcionService } from './inscripcion.service';
import { Profesor } from '../models/profesor';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private cursos: BehaviorSubject<Curso[]>;

  constructor(private alumnoService: AlumnoService, private profesorService: ProfesorService, private inscripcionService: InscripcionService) {
    this.cursos = new BehaviorSubject<Curso[]>([]);
  }

  obtenerCursos(): Observable<Curso[]> {
    if (cursosData.length > 0)
      this.cursos.next(cursosData);
    else
      this.cursos.error(new Error("No hay data."));
    return this.cursos.asObservable();
  }

  obtenerCurso(cursoId: number): Observable<Curso | undefined> {
    return this.cursos.pipe(
      map(cursosData => cursosData.find(curso => curso.id === cursoId))
    );
  }

  eliminarCurso(curso: Curso): Observable<Curso> {
    const index = cursosData.findIndex(c => c.id === curso.id);
    if (index !== -1) {
      cursosData.splice(index, 1);
      this.cursos.next([...cursosData]);
    }

    return of(curso);
  }

  altaCurso(curso: Curso): Observable<Curso> {
    cursosData.push(curso);
    this.cursos.next([...cursosData]); //

    return of(curso);
  }

  modificarCurso(curso: Curso): Observable<Curso> {
    const index = cursosData.findIndex(c => c.id === curso.id);
    if (index !== -1) {
      cursosData[index] = curso;
      this.cursos.next([...cursosData]);
    }

    return of(curso);
  }

  obtenerAlumnos(cursoId: number): Observable<Alumno[] | undefined> {
    const inscripciones: Inscripcion[] = inscripcionesData.filter(i => i.idCurso === cursoId);
    const alumnos: Alumno[] = inscripciones.map(i => alumnosData.find(a => a.id === i.idAlumno)!);

    return of(alumnos);
  }

  obtenerProfesor(profesorId: number): Observable<Profesor | undefined> {
    return this.profesorService.obtenerProfesor(profesorId);
  }

  bajaAlumnoCurso(cursoId: number, alumnoId: number): Observable<Inscripcion> {
    const index = inscripcionesData.findIndex((inscripcion) => inscripcion.idAlumno === alumnoId && inscripcion.idCurso === cursoId);
    return of(inscripcionesData.splice(index, 1)[0]);
  }

  // deleteAlumnoFromCurso(cursoId: number, alumnoId: number): Observable<Inscripcion> {
  //   return this.inscripcionService.obtenerInscripcionPorCursoAlumno(cursoId, alumnoId).pipe(
  //     switchMap(inscripcion => {
  //       if (!inscripcion) {
  //         return forkJoin([]);
  //       } else {
  //         return this.inscripcionService.eliminarInscripcion(inscripcion);
  //       }
  //     })
  //   );
  // }

  bajaProfesorCurso(cursoId: number, profesorId: number): Observable<number> {
    const curso = cursosData.find((curso) => curso.id == cursoId && curso.id === profesorId);
    if (curso)
      curso.idProfesor = undefined;

    return of(profesorId);
  }

}

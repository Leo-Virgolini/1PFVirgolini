import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, mergeMap, Observable, of, switchMap, throwError } from 'rxjs';
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
    return this.http.get<any[]>(this.url)
      .pipe(
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
    return this.http.get<any>(this.url + '/' + cursoId)
      .pipe(
        mergeMap((curso: any) =>
          forkJoin([
            this.profesorService.obtenerProfesor(curso.idProfesor),
            this.obtenerAlumnos(curso.id)
          ])
            .pipe(
              map(([profesor, alumnos]) => new Curso(curso.id, curso.materia, profesor, alumnos))
            )
        )
      );
  }

  eliminarCurso(curso: Curso): Observable<Curso> {
    return this.eliminarInscripciones(curso.id) // Elimina Inscripciones asociadas al Curso
      .pipe(
        switchMap(() => this.http.delete<Curso>(this.url + '/' + curso.id)
          .pipe(
            map(() => curso)
          ))
      );
  }

  altaCurso(curso: Curso): Observable<Curso> {

    const cursoData = {
      materia: curso.materia,
      idProfesor: curso.profesor ? curso.profesor.id : undefined
    };

    return this.http.post<Curso>(this.url, cursoData);
  }

  modificarCurso(curso: Curso): Observable<Curso> {

    const cursoData = {
      id: curso.id,
      materia: curso.materia,
      idProfesor: curso.profesor ? curso.profesor.id : undefined
    };

    return this.http.put<Curso>(this.url + '/' + curso.id, cursoData);
  }

  obtenerAlumnos(cursoId: number): Observable<Alumno[] | null> {
    console.log("cursoId", cursoId);
    if (cursoId) {
      return this.http.get<any[]>(environment.url + `/inscripciones?idCurso=${cursoId}`).pipe(
        switchMap(inscripciones => {
          if (inscripciones.length === 0) {
            return of([]);
          } else {
            return forkJoin(inscripciones.map(inscripcion => this.http.get<Alumno>(environment.url + `/usuarios/${inscripcion.idAlumno}`)));
          }
        })
      );
    } else {
      return of(null);
    }
  }

  obtenerProfesor(profesorId: number | undefined): Observable<Profesor | null> {
    if (profesorId)
      return this.http.get<Profesor>(environment.url + "/usuarios/" + profesorId);
    else
      return of(null);
  }

  bajaAlumnoCurso(cursoId: number, alumnoId: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(environment.url + "/inscripciones?idCurso=" + cursoId + '&idAlumno=' + alumnoId).pipe(
      switchMap(
        (inscripcion) => this.http.delete<Inscripcion>(environment.url + "/inscripciones/" + inscripcion.id)
      )
    );
  }

  bajaProfesorCurso(curso: Curso): Observable<Curso> {
    curso.profesor = null;
    return this.http.put<Curso>(this.url + '/' + curso.id, curso);
  }

  // eliminarInscripciones(cursoId: number): Observable<Inscripcion[]> {
  //   return this.http.get<Inscripcion[]>(environment.url + '/inscripciones' + '?idCurso=' + cursoId)
  //     .pipe(
  //       map((inscripciones) => {
  //         inscripciones.forEach((inscripcion) => this.http.delete<Inscripcion>(environment.url + '/inscripciones/' + inscripcion.id).subscribe());
  //         return inscripciones;
  //       })
  //     );
  // }

  eliminarInscripciones(cursoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(environment.url + '/inscripciones?idCurso=' + cursoId).pipe(
      switchMap((inscripciones) => {
        if (inscripciones.length === 0) {
          // No inscriptions to delete, return an empty array
          return of([]);
        }

        const deletionObservables = inscripciones.map((inscripcion) =>
          this.http.delete<Inscripcion>(environment.url + '/inscripciones/' + inscripcion.id).pipe(
            catchError((error) => {
              // Log the error or handle it as needed
              console.error(`Error deleting inscripcion with ID ${inscripcion.id}`, error);
              // Continue with the deletion of other inscriptions
              return throwError(() => error);
            })
          )
        );

        // Use forkJoin to wait for all deletions to complete
        return forkJoin(deletionObservables).pipe(map(() => inscripciones));
      })
    );
  }

}
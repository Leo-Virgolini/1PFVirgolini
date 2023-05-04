import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Curso } from '../models/curso';
import { Inscripcion } from '../models/inscripcion';
import { Alumno } from '../models/alumno';
import { Profesor } from '../models/profesor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private readonly url: string = "http://localhost:3000/cursos";
  private cursos: BehaviorSubject<Curso[]>;

  constructor(private http: HttpClient) {
    this.cursos = new BehaviorSubject<Curso[]>([]);
  }

  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.url);
  }

  obtenerCurso(cursoId: number): Observable<Curso | undefined> {
    return this.http.get<Curso>(this.url + '/' + cursoId);
  }

  eliminarCurso(curso: Curso): Observable<Curso> {
    return this.http.delete<Curso>(this.url + '/' + curso.id);
  }

  altaCurso(curso: Curso): Observable<Curso> {

    const cursoData = {
      id: curso.id,
      materia: curso.materia,
      idProfesor: curso.idProfesor
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
    return this.http.get<Inscripcion[]>(`http://localhost:3000/inscripciones?idCurso=${cursoId}`)
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
    curso.idProfesor = undefined;
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

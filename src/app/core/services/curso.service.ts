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
    // if (cursosData.length > 0)
    //   this.cursos.next(cursosData);
    // else
    //   this.cursos.error(new Error("No hay data."));
    // return this.cursos.asObservable();
  }

  obtenerCurso(cursoId: number): Observable<Curso | undefined> {
    return this.http.get<Curso>(this.url + '/' + cursoId);
    // return this.obtenerCursos().pipe(
    //   map(cursosData => cursosData.find(curso => curso.id === cursoId))
    // );
  }

  eliminarCurso(curso: Curso): Observable<Curso> {
    return this.http.delete<Curso>(this.url + '/' + curso.id);
    // const index = cursosData.findIndex(c => c.id === curso.id);
    // if (index !== -1) {
    //   cursosData.splice(index, 1);
    //   this.cursos.next([...cursosData]);
    // }

    // return of(curso);
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

    // cursosData.push(curso);
    // this.cursos.next([...cursosData]); //

    // return of(curso);
  }

  modificarCurso(curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(this.url + '/' + curso.id, curso);
    // const index = cursosData.findIndex(c => c.id === curso.id);
    // if (index !== -1) {
    //   cursosData[index] = curso;
    //   this.cursos.next([...cursosData]);
    // }

    // return of(curso);
  }

  obtenerAlumnos(cursoId: number): Observable<Alumno[] | undefined> {
    return this.http.get<Inscripcion[]>(`http://localhost:3000/inscripciones?idCurso=${cursoId}`).pipe(
      switchMap(inscripciones =>
        forkJoin(
          inscripciones.map(inscripcion => this.http.get<Alumno>(`http://localhost:3000/alumnos/${inscripcion.idAlumno}`))
        )
      )
    );

    // const inscripciones: Inscripcion[] = inscripcionesData.filter(i => i.idCurso === cursoId);
    // const alumnos: Alumno[] = inscripciones.map(i => alumnosData.find(a => a.id === i.idAlumno)!);

    // return of(alumnos);
  }

  obtenerProfesor(profesorId: number): Observable<Profesor | undefined> {
    return this.http.get<Profesor>("http://localhost:3000/profesores" + '/' + profesorId);

    // return this.profesorService.obtenerProfesor(profesorId);
  }

  bajaAlumnoCurso(cursoId: number, alumnoId: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>("http://localhost:3000/inscripciones" + '?idCurso=' + cursoId + '&idAlumno=' + alumnoId).pipe(
      switchMap(
        (inscripcion) => this.http.delete<Inscripcion>("http://localhost:3000/inscripciones" + '/' + inscripcion.id)
      )
    );
    // const index = inscripcionesData.findIndex((inscripcion) => inscripcion.idAlumno === alumnoId && inscripcion.idCurso === cursoId);
    // return of(inscripcionesData.splice(index, 1)[0]);
  }

  bajaProfesorCurso(curso: Curso): Observable<Curso> {
    curso.idProfesor = undefined;
    return this.http.put<Curso>(this.url + '/' + curso.id, curso);
  }

  getUltimoId(): Observable<number> {
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

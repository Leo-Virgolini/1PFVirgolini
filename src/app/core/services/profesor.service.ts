import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, mergeMap, of, switchMap } from 'rxjs';
import { Profesor } from '../models/profesor';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
import { CursoService } from './curso.service';
import { Curso } from '../models/curso';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private readonly url: string = environment.url + "/usuarios";
  private profesores!: BehaviorSubject<Profesor[]>;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.profesores = new BehaviorSubject<Profesor[]>([]);
  }

  obtenerProfesores(): Observable<Profesor[]> {
    return this.http.get<any[]>(this.url + '?rol=profesor')
      .pipe(
        mergeMap((profesores: any[]) => {
          const observables = profesores.map((profesor: any) =>
            this.obtenerCursosPorProfesor(profesor.id)
              .pipe(
                map(cursos => new Profesor(profesor.id, profesor.nombre, profesor.apellido, profesor.fechaNacimiento, profesor.dni, profesor.email, profesor.password, "profesor", cursos))
              )
          );

          return forkJoin(observables);
        })
      );
  }

  obtenerProfesor(profesorId: number): Observable<Profesor | null> {
    console.log("profesorId", profesorId);
    if (profesorId)
      return this.http.get<Profesor>(this.url + '/' + profesorId);
    else
      return of(null);
  }

  altaProfesor(profesor: Profesor): Observable<Profesor> {

    const profesorData = {
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      fechaNacimiento: this.datePipe.transform(new Date(profesor.fechaNacimiento), 'yyyy-MM-dd'),
      dni: profesor.dni,
      email: profesor.email,
      password: profesor.password,
      rol: profesor.rol
    };

    return this.http.post<Profesor>(this.url, profesorData);
  }

  modificarProfesor(profesor: Profesor): Observable<Profesor> {

    const profesorData = {
      id: profesor.id,
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      fechaNacimiento: this.datePipe.transform(new Date(profesor.fechaNacimiento), 'yyyy-MM-dd'),
      dni: profesor.dni,
      email: profesor.email,
      password: profesor.password,
      rol: profesor.rol
    };

    return this.http.put<Profesor>(this.url + '/' + profesorData.id, profesorData);
  }

  eliminarProfesor(profesor: Profesor): Observable<Profesor> {
    return this.bajaProfesorCursos(profesor.id) // Da de baja al Profesor de los Cursos asociados
      .pipe(
        switchMap(() => this.http.delete<Profesor>(this.url + '/' + profesor.id)
          .pipe(
            map(() => profesor)
          ))
      );
  }

  obtenerCursosPorProfesor(profesorId: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(environment.url + '/cursos?idProfesor=' + profesorId);
  }

  bajaProfesorCursos(profesorId: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(environment.url + '/cursos' + '?idProfesor=' + profesorId).pipe(
      switchMap((cursos) => {
        const observables = cursos.map((curso) => {
          const cursoData = {
            id: curso.id,
            materia: curso.materia,
            idProfesor: null
          };
          return this.http.put<any>(environment.url + '/cursos/' + curso.id, cursoData);
        });
        return forkJoin(observables).pipe(map(() => cursos));
      })
    );
  }

}

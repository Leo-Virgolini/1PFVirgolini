import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, mergeMap, switchMap } from 'rxjs';
import { Profesor } from '../models/profesor';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
import { CursoService } from './curso.service';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private readonly url: string = environment.url + "/profesores";
  private profesores!: BehaviorSubject<Profesor[]>;

  constructor(private http: HttpClient) {
    this.profesores = new BehaviorSubject<Profesor[]>([]);
  }

  obtenerProfesores(): Observable<Profesor[]> {
    return this.http.get<any[]>(this.url)
      .pipe(
        mergeMap((profesores: any[]) => {
          const observables = profesores.map((profesor: any) =>
            this.obtenerCursosPorProfesor(profesor.id)
              .pipe(
                map(cursos => new Profesor(profesor.id, profesor.nombre, profesor.apellido, profesor.fechaNacimiento, profesor.dni, profesor.email, profesor.password, cursos))
              )
          );

          return forkJoin(observables);
        })
      );
  }

  obtenerProfesor(profesorId: number): Observable<Profesor> {
    return this.http.get<Profesor>(this.url + '/' + profesorId);
  }

  altaProfesor(profesor: Profesor): Observable<Profesor> {

    const profesorData = {
      id: profesor.id,
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      fechaNacimiento: profesor.fechaNacimiento,
      dni: profesor.dni,
      email: profesor.email,
      password: profesor.password
    };

    return this.getUltimoId().
      pipe(
        map((id) => {
          profesorData.id = id + 1;
          return profesorData;
        }),
        switchMap((p) => {
          return this.http.post<Profesor>(this.url, p);
        })
      );
  }

  modificarProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(this.url + '/' + profesor.id, profesor);
  }

  eliminarProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.delete<Profesor>(this.url + '/' + profesor.id)
      .pipe(
        map(() => profesor)
      );
  }

  obtenerCursosPorProfesor(profesorId: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(environment.url + '/cursos?idProfesor=' + profesorId);
  }

  private getUltimoId(): Observable<number> {
    return this.http.get<any[]>(this.url)
      .pipe(
        map(profesores => {
          let ultimoId = 0;
          profesores.forEach(profesor => {
            if (profesor.id > ultimoId) {
              ultimoId = profesor.id;
            }
          });
          return ultimoId;
        })
      );
  }

}

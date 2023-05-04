import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Profesor } from '../models/profesor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private readonly url: string = "http://localhost:3000/profesores";
  private profesores!: BehaviorSubject<Profesor[]>;

  constructor(private http: HttpClient) {
    this.profesores = new BehaviorSubject<Profesor[]>([]);
  }

  obtenerProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.url);
  }

  obtenerProfesor(profesorId: number): Observable<Profesor | undefined> {
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
    return this.http.delete<Profesor>(this.url + '/' + profesor.id);
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

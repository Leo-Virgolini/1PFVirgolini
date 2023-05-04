import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Profesor } from '../models/profesor';
import { profesoresData } from '../data';
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
    // if (profesoresData.length > 0)
    //   this.profesores.next(profesoresData);
    // else
    //   this.profesores.error(new Error("No hay data."));
    // return this.profesores.asObservable();
  }

  obtenerProfesor(profesorId: number): Observable<Profesor | undefined> {

    return this.http.get<Profesor>(this.url + '/' + profesorId);
    // return of(profesoresData.find(profesor => profesor.id === profesorId));
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

    // profesoresData.push(profesor);
    // this.profesores.next([...profesoresData]);

    // return of(profesor);
  }

  modificarProfesor(profesor: Profesor): Observable<Profesor> {

    return this.http.put<Profesor>(this.url + '/' + profesor.id, profesor);
    // const index = profesoresData.findIndex(a => a.id === profesor.id);
    // if (index !== -1) {
    //   profesoresData[index] = profesor;
    //   this.profesores.next([...profesoresData]);
    // }

    // return of(profesor);
  }

  eliminarProfesor(profesor: Profesor): Observable<Profesor> {

    return this.http.delete<Profesor>(this.url + '/' + profesor.id);
    // const index = profesoresData.findIndex(a => a.id === profesor.id);
    // if (index !== -1) {
    //   profesoresData.splice(index, 1);
    //   this.profesores.next([...profesoresData]);
    // }

    // return of(profesor);
  }

  getUltimoId(): Observable<number> {
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

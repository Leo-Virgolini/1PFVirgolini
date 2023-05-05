import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Alumno } from '../models/alumno';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
import { Inscripcion } from '../models/inscripcion';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private readonly url: string = environment.url + "/alumnos";
  private alumnos!: BehaviorSubject<Alumno[]>;

  constructor(private http: HttpClient) {
    this.alumnos = new BehaviorSubject<Alumno[]>([]);
  }

  obtenerAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.url);
  }

  obtenerAlumno(alumnoId: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.url + '/' + alumnoId);
  }

  altaAlumno(alumno: Alumno): Observable<Alumno> {

    const alumnoData = {
      id: alumno.id,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      fechaNacimiento: alumno.fechaNacimiento,
      dni: alumno.dni,
      provincia: alumno.provincia,
      localidad: alumno.localidad,
      calle: alumno.calle,
      email: alumno.email,
      password: alumno.password
    };

    return this.getUltimoId().
      pipe(
        map((id) => {
          alumnoData.id = id + 1;
          return alumnoData;
        }),
        switchMap((al) => {
          return this.http.post<Alumno>(this.url, al);
        })
      );
  }

  modificarAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(this.url + '/' + alumno.id, alumno);
  }

  eliminarAlumno(alumno: Alumno): Observable<Alumno> {
    return this.eliminarInscripciones(alumno.id!) // Elimina Inscripciones asociadas al Alumno
      .pipe(
        switchMap(() => this.http.delete<Alumno>(this.url + '/' + alumno.id)
          .pipe(
            map(() => alumno)
          ))
      );
  }

  private getUltimoId(): Observable<number> {
    return this.http.get<any[]>(this.url)
      .pipe(
        map(alumnos => {
          let ultimoId = 0;
          alumnos.forEach(alumno => {
            if (alumno.id > ultimoId) {
              ultimoId = alumno.id;
            }
          });
          return ultimoId;
        })
      );
  }

  eliminarInscripciones(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.delete<Inscripcion[]>(environment.url + '/inscripciones?idAlumno=' + alumnoId);
  }

}

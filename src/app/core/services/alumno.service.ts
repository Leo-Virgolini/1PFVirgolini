import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Alumno } from '../models/alumno';
import { InscripcionService } from './inscripcion.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private readonly url: string = "http://localhost:3000/alumnos";
  private alumnos!: BehaviorSubject<Alumno[]>;

  constructor(private http: HttpClient, private inscripcionService: InscripcionService) {
    this.alumnos = new BehaviorSubject<Alumno[]>([]);
  }

  obtenerAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.url);
  }

  obtenerAlumno(alumnoId: number): Observable<Alumno | undefined> {
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
    return this.inscripcionService.eliminarInscripciones(alumno.id) // Elimina Inscripciones asociadas al Alumno
      .pipe(
        switchMap(() => this.http.delete<Alumno>(this.url + '/' + alumno.id))
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

}

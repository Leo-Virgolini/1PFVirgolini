import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Alumno } from '../models/alumno';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
import { Inscripcion } from '../models/inscripcion';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private readonly url: string = environment.url + "/usuarios";
  private alumnos!: BehaviorSubject<Alumno[]>;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.alumnos = new BehaviorSubject<Alumno[]>([]);
  }

  obtenerAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.url + "?rol=alumno");
  }

  obtenerAlumno(alumnoId: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.url + '/' + alumnoId);
  }

  altaAlumno(alumno: Alumno): Observable<Alumno> {

    const alumnoData = {
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      fechaNacimiento: this.datePipe.transform(new Date(alumno.fechaNacimiento), 'yyyy-MM-dd'),
      dni: alumno.dni,
      provincia: alumno.provincia,
      localidad: alumno.localidad,
      calle: alumno.calle,
      email: alumno.email,
      password: alumno.password,
      rol: alumno.rol
    };

    return this.http.post<Alumno>(this.url, alumnoData)
  }

  modificarAlumno(alumno: Alumno): Observable<Alumno> {

    const alumnoData = {
      id: alumno.id,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      fechaNacimiento: this.datePipe.transform(new Date(alumno.fechaNacimiento), 'yyyy-MM-dd'),
      dni: alumno.dni,
      provincia: alumno.provincia,
      localidad: alumno.localidad,
      calle: alumno.calle,
      email: alumno.email,
      password: alumno.password,
      rol: alumno.rol
    };

    return this.http.put<Alumno>(this.url + '/' + alumnoData.id, alumnoData);
  }

  eliminarAlumno(alumno: Alumno): Observable<Alumno> {
    return this.eliminarInscripciones(alumno.id) // Elimina Inscripciones asociadas al Alumno
      .pipe(
        switchMap(() => this.http.delete<Alumno>(this.url + '/' + alumno.id)
          .pipe(
            map(() => alumno)
          ))
      );
  }

  eliminarInscripciones(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(environment.url + '/inscripciones' + '?idAlumno=' + alumnoId)
      .pipe(
        map((inscripciones) => {
          inscripciones.forEach((inscripcion) => this.http.delete<Inscripcion>(environment.url + '/inscripciones/' + inscripcion.id).subscribe());
          return inscripciones;
        })
      );
  }

}

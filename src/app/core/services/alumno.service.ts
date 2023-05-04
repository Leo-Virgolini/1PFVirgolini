import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Alumno } from '../models/alumno';
import { alumnosData } from '../data';
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

    // if (alumnosData.length > 0)
    //   this.alumnos.next(alumnosData);
    // else
    //   this.alumnos.error(new Error("No hay data."));
    // // this.alumnos.complete();
    // return this.alumnos.asObservable();
  }

  obtenerAlumno(alumnoId: number): Observable<Alumno | undefined> {
    return this.http.get<Alumno>(this.url + '/' + alumnoId);

    // return this.obtenerAlumnos().pipe(
    //   map(alumnosData => alumnosData.find(alummno => alummno.id === alumnoId))
    // );
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

    // const index = alumnosData.findIndex(a => a.id === alumno.id);
    // if (index !== -1) {
    //   alumnosData[index] = alumno;
    //   this.alumnos.next([...alumnosData]);
    // }

    // return of(alumno);
  }

  eliminarAlumno(alumno: Alumno): Observable<Alumno> {

    return this.http.delete<Alumno>(this.url + '/' + alumno.id);
    // this.inscripcionService.eliminarInscripciones(alumno.id).subscribe((inscripciones) => { // eliminar Inscripciones asociadas
    //   const index = alumnosData.findIndex(a => a.id === alumno.id);
    //   if (index !== -1) {
    //     alumnosData.splice(index, 1);
    //     this.alumnos.next([...alumnosData]);
    //   }
    // });

    // return of(alumno);
  }

  getUltimoId(): Observable<number> {
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

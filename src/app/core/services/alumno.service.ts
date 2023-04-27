import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Alumno } from '../models/alumno';
import { alumnosData } from '../data';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private alumnos!: BehaviorSubject<Alumno[]>;

  constructor() {
    this.alumnos = new BehaviorSubject<Alumno[]>([]);
  }

  obtenerAlumnos(): Observable<Alumno[]> {
    if (alumnosData.length > 0)
      this.alumnos.next(alumnosData);
    else
      this.alumnos.error(new Error("No hay data."));
    // this.alumnos.complete();
    return this.alumnos.asObservable();
  }

  obtenerAlumno(alumnoId: number): Observable<Alumno | undefined> {
    return this.alumnos.pipe(
      map(alumnosData => alumnosData.find(alummno => alummno.id === alumnoId))
    );
  }

  altaAlumno(alumno: Alumno): Observable<Alumno> {
    alumnosData.push(alumno);
    this.alumnos.next([...alumnosData]);

    return of(alumno);
  }

  modificarAlumno(alumno: Alumno): Observable<Alumno> {
    const index = alumnosData.findIndex(a => a.id === alumno.id);
    if (index !== -1) {
      alumnosData[index] = alumno;
      this.alumnos.next([...alumnosData]);
    }

    return of(alumno);
  }

  eliminarAlumno(alumno: Alumno): Observable<Alumno> {
    const index = alumnosData.findIndex(a => a.id === alumno.id);
    if (index !== -1) {
      alumnosData.splice(index, 1);
      this.alumnos.next([...alumnosData]);
    }

    return of(alumno);
  }

}

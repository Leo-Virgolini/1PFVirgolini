import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Profesor } from '../models/profesor';
import { profesoresData } from '../data';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private profesores!: BehaviorSubject<Profesor[]>;

  constructor() {
    this.profesores = new BehaviorSubject<Profesor[]>([]);
  }

  obtenerProfesores(): Observable<Profesor[]> {
    if (profesoresData.length > 0)
      this.profesores.next(profesoresData);
    else
      this.profesores.error(new Error("No hay data."));
    return this.profesores.asObservable();
  }

  obtenerProfesor(profesorId: number): Observable<Profesor | undefined> {
    return of(profesoresData.find(profesor => profesor.id === profesorId));
  }

  altaProfesor(profesor: Profesor): Observable<Profesor> {
    profesoresData.push(profesor);
    this.profesores.next([...profesoresData]);

    return of(profesor);
  }

  modificarProfesor(profesor: Profesor): Observable<Profesor> {
    const index = profesoresData.findIndex(a => a.id === profesor.id);
    if (index !== -1) {
      profesoresData[index] = profesor;
      this.profesores.next([...profesoresData]);
    }

    return of(profesor);
  }

  eliminarProfesor(profesor: Profesor): Observable<Profesor> {
    const index = profesoresData.findIndex(a => a.id === profesor.id);
    if (index !== -1) {
      profesoresData.splice(index, 1);
      this.profesores.next([...profesoresData]);
    }

    return of(profesor);
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Inscripcion } from '../models/inscripcion';
import { inscripcionesData } from '../data';
import { AlumnoService } from './alumno.service';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private inscripciones!: BehaviorSubject<Inscripcion[]>;

  constructor() {
    this.inscripciones = new BehaviorSubject<Inscripcion[]>([]);
    if (inscripcionesData.length > 0)
      this.inscripciones.next(inscripcionesData);
    else
      this.inscripciones.error(new Error("No hay data."));
  }

  obtenerInscripciones(): Observable<Inscripcion[]> {
    return this.inscripciones.asObservable();
  }

  obtenerInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[] | undefined> {
    const inscripciones = inscripcionesData.filter(inscripcion => inscripcion.idCurso === cursoId);
    return of(inscripciones);
  }

  obtenerInscripcion(inscripcionId: number): Observable<Inscripcion | undefined> {
    return this.inscripciones.pipe(
      map(inscripcionesData => inscripcionesData.find(inscripcion => inscripcion.id === inscripcionId))
    );
  }

  obtenerInscripcionPorCursoAlumno(cursoId: number, alumnoId: number): Observable<Inscripcion | undefined> {
    return this.inscripciones.pipe(
      map(inscripcionesData => inscripcionesData.find(inscripcion => inscripcion.idCurso === cursoId && inscripcion.idAlumno === alumnoId))
    );
  }

  // obtenerAlumno(inscripcion: Inscripcion): Observable<Alumno | undefined> {
  //   return this.alumnoService.obtenerAlumno(inscripcion.idAlumno);
  // }

  // obtenerCurso(inscripcion: Inscripcion): Observable<Curso | undefined> {
  //   return this.cursoService.obtenerCurso(inscripcion.idCurso);
  // }

  altaInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    inscripcionesData.push(inscripcion);
    this.inscripciones.next([...inscripcionesData]);

    return of(inscripcion);
  }

  modificarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const index = inscripcionesData.findIndex(i => i.id === inscripcion.id);
    if (index !== -1) {
      inscripcionesData[index] = inscripcion;
      this.inscripciones.next([...inscripcionesData]);
    }

    return of(inscripcion);
  }

  eliminarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const index = inscripcionesData.findIndex(i => i.id === inscripcion.id);
    if (index !== -1) {
      inscripcionesData.splice(index, 1);
      this.inscripciones.next([...inscripcionesData]);
    }

    return of(inscripcion);
  }

}

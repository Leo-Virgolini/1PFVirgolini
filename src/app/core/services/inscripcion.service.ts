import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Inscripcion } from '../models/inscripcion';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private readonly url: string = "http://localhost:3000/inscripciones";
  private inscripciones!: BehaviorSubject<Inscripcion[]>;

  constructor(private http: HttpClient) {
    this.inscripciones = new BehaviorSubject<Inscripcion[]>([]);
  }

  obtenerInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.url);
  }

  obtenerInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[] | undefined> {
    return this.http.get<Inscripcion[]>(this.url + '?idCurso=' + cursoId);
  }

  obtenerInscripcion(inscripcionId: number): Observable<Inscripcion | undefined> {
    return this.http.get<Inscripcion>(this.url + '/' + inscripcionId);
  }

  obtenerInscripcionPorCursoAlumno(cursoId: number, alumnoId: number): Observable<Inscripcion | undefined> {
    return this.http.get<Inscripcion>(this.url + '?idCurso=' + cursoId + '&idAlumno=' + alumnoId);
  }

  // obtenerAlumno(inscripcion: Inscripcion): Observable<Alumno | undefined> {
  //   return this.alumnoService.obtenerAlumno(inscripcion.idAlumno);
  // }

  // obtenerCurso(inscripcion: Inscripcion): Observable<Curso | undefined> {
  //   return this.cursoService.obtenerCurso(inscripcion.idCurso);
  // }

  altaInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const inscripcionData = {
      id: inscripcion.id,
      idCurso: inscripcion.idCurso,
      idAlumno: inscripcion.idAlumno
    };
    return this.getUltimoId().
      pipe(
        map((id) => {
          inscripcionData.id = id + 1;
          return inscripcionData;
        }),
        switchMap((i) => {
          return this.http.post<Inscripcion>(this.url, i);
        })
      );
  }

  modificarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.put<Inscripcion>(this.url + '/' + inscripcion.id, inscripcion);
  }

  eliminarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.delete<Inscripcion>(this.url + '/' + inscripcion.id);
  }

  // eliminarInscripciones(alumnoId: number): Observable<Inscripcion[]> {
  //   return this.http.get<Inscripcion[]>(this.url + '?idAlumno=' + alumnoId)
  //     .pipe(
  //       map((inscripciones) => {
  //         inscripciones.forEach((inscripcion) => this.http.delete<Inscripcion>(this.url + '/' + inscripcion.id).subscribe());
  //         return inscripciones;
  //       })
  //     );
  // }

  eliminarInscripciones(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.delete<Inscripcion[]>(this.url + '?idAlumno=' + alumnoId);
  }

  private getUltimoId(): Observable<number> {
    return this.http.get<any[]>(this.url)
      .pipe(
        map(inscripciones => {
          let ultimoId = 0;
          inscripciones.forEach(inscripcion => {
            if (inscripcion.id > ultimoId) {
              ultimoId = inscripcion.id;
            }
          });
          return ultimoId;
        })
      );
  }

}

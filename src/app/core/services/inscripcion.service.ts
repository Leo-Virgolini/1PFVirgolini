import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Inscripcion } from '../models/inscripcion';
import { inscripcionesData } from '../data';
import { Curso } from '../models/curso';
import { Alumno } from '../models/alumno';
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

    // if (inscripcionesData.length > 0)
    //   this.inscripciones.next(inscripcionesData);
    // else
    //   this.inscripciones.error(new Error("No hay data."));
    // return this.inscripciones.asObservable();
  }

  obtenerInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[] | undefined> {
    return this.http.get<Inscripcion[]>(this.url + '?idCurso=' + cursoId);

    // const inscripciones = inscripcionesData.filter(inscripcion => inscripcion.idCurso === cursoId);
    // return of(inscripciones);
  }

  obtenerInscripcion(inscripcionId: number): Observable<Inscripcion | undefined> {
    return this.http.get<Inscripcion>(this.url + '/' + inscripcionId);
    // return this.obtenerInscripciones().pipe(
    //   map(inscripcionesData => inscripcionesData.find(inscripcion => inscripcion.id === inscripcionId))
    // );
  }

  obtenerInscripcionPorCursoAlumno(cursoId: number, alumnoId: number): Observable<Inscripcion | undefined> {
    return this.http.get<Inscripcion>(this.url + '?idCurso=' + cursoId + '&idAlumno=' + alumnoId);

    // return this.inscripciones.pipe(
    //   map(inscripcionesData => inscripcionesData.find(inscripcion => inscripcion.idCurso === cursoId && inscripcion.idAlumno === alumnoId))
    // );
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

    // inscripcionesData.push(inscripcion);
    // this.inscripciones.next([...inscripcionesData]);

    // return of(inscripcion);
  }

  modificarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {

    return this.http.put<Inscripcion>(this.url + '/' + inscripcion.id, inscripcion);
    // const index = inscripcionesData.findIndex(i => i.id === inscripcion.id);
    // if (index !== -1) {
    //   inscripcionesData[index] = inscripcion;
    //   this.inscripciones.next([...inscripcionesData]);
    // }

    // return of(inscripcion);
  }

  eliminarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {

    return this.http.delete<Inscripcion>(this.url + '/' + inscripcion.id);
    // const index = inscripcionesData.findIndex(i => i.id === inscripcion.id);
    // if (index !== -1) {
    //   inscripcionesData.splice(index, 1);
    //   this.inscripciones.next([...inscripcionesData]);
    // }

    // return of(inscripcion);
  }

  eliminarInscripciones(alumnoId: number): Observable<Inscripcion[]> {

    return this.http.get<Inscripcion[]>(this.url + '?idAlumno=' + alumnoId).pipe(
      map((inscripciones) => {
        inscripciones.forEach((inscripcion) => this.http.delete<Inscripcion>(this.url + '/' + inscripcion.id).subscribe());
        return inscripciones;
      })
    );

    // const inscripciones: Inscripcion[] = inscripcionesData.filter(i => i.idAlumno === alumnoId);
    // if (inscripciones) {
    //   inscripciones.forEach((inscripcion) => {
    //     const index = inscripcionesData.findIndex((i) => i.id === inscripcion.id);
    //     inscripcionesData.splice(index, 1);
    //   });

    //   this.inscripciones.next([...inscripcionesData]);
    // }

    // return of(inscripciones);
  }

  getUltimoId(): Observable<number> {
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

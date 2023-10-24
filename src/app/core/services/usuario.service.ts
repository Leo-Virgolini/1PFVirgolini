import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly url: string = environment.url + "/usuarios";
  private usuarios!: BehaviorSubject<Usuario[]>;

  constructor(private http: HttpClient) {
    this.usuarios = new BehaviorSubject<Usuario[]>([]);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  obtenerUsuario(usuarioId: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.url + '/' + usuarioId);
  }

  altaUsuario(usuario: Usuario): Observable<Usuario> {

    const usuarioData = {
      email: usuario.email,
      password: usuario.password,
      rol: usuario.rol,
      token: usuario.token
    };

    return this.http.post<Usuario>(this.url, usuarioData)
  }

  modificarUsuario(usuario: Usuario): Observable<Usuario> {

    const usuarioData = {
      id: usuario.id,
      email: usuario.email,
      password: usuario.password,
      rol: usuario.rol,
      token: usuario.token
    };

    return this.http.put<Usuario>(this.url + '/' + usuario.id, usuarioData);
  }

  eliminarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.delete<Usuario>(this.url + '/' + usuario.id)
      .pipe(
        map(() => usuario)
      );
  }

}

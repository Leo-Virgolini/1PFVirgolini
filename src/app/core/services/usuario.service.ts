import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';
import { usuariosData } from '../data';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor() { }

  obtenerUsuario(email: string, password: string): Observable<Usuario> | null {
    const usuario = usuariosData.find(usuario => usuario.email === email && usuario.password === password);
    if (usuario)
      return of(usuario);
    else
      return null;
  }

}

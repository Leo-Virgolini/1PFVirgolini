import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, catchError, of, switchMap } from 'rxjs';
import { Usuario } from 'src/app/core/models/usuario';
import { environment } from 'src/environments/environments.prod';
import { UsuarioService } from './usuario.service';

export interface LoginFormValue {
  emailControl: string;
  passwordControl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUser$ = new BehaviorSubject<Usuario | null>(null);

  constructor(private router: Router, private httpClient: HttpClient, private usuarioService: UsuarioService) {
  }

  obtenerUsuarioAutenticado(): Observable<Usuario | null> {
    return this.authUser$.asObservable();
  }

  login(formValue: LoginFormValue): Observable<boolean> {
    console.log("login running");
    console.log("form", formValue);

    return this.httpClient.get<Usuario[]>(`${environment.url}/usuarios`, {
      params: { "email": formValue.emailControl, "password": formValue.passwordControl }
    }).pipe(
      switchMap((usuarios) => {
        const usuarioAutenticado: Usuario | undefined = usuarios.find((usuario) => usuario.email === formValue.emailControl && usuario.password === formValue.passwordControl);
        console.log("usuarioAutenticado", usuarioAutenticado);

        if (usuarioAutenticado) {
          return this.usuarioService.generarToken(usuarioAutenticado).pipe(
            map((usuarioConToken) => {
              if (usuarioConToken.token) {
                localStorage.setItem('token', usuarioConToken.token);
              }
              this.authUser$.next(usuarioConToken);
              this.router.navigate(['home']);
              return true;
            })
          );
        } else {
          return of(false);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authUser$.next(null);
    this.router.navigate(['login'], { queryParams: { logout: true } });
  }

  verificarToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.httpClient.get<Usuario[]>(`${environment.url}/usuarios?token=${token}`,
        {
          headers: new HttpHeaders({
            'Authorization': token || ''
          })
        }
      )
        .pipe(
          map((usuarios) => {
            const usuarioAutenticado = usuarios[0];
            if (usuarioAutenticado) {
              if (usuarioAutenticado.token)
                localStorage.setItem('token', usuarioAutenticado.token);
              this.authUser$.next(usuarioAutenticado);
            }
            return !!usuarioAutenticado;
          }),
          catchError((err) => {
            console.log('Error al verificar el token');
            // return throwError(() => err);
            return of(false);
          })
        );
    } else {
      return of(false);
    }
  }

}

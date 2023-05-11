import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { Usuario } from 'src/app/core/models/usuario';
import { environment } from 'src/environments/environments.prod';

export interface LoginFormValue {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUser$ = new BehaviorSubject<Usuario | null>(null);

  constructor(private router: Router, private httpClient: HttpClient) {
  }

  obtenerUsuarioAutenticado(): Observable<Usuario | null> {
    return this.authUser$.asObservable();
  }

  login(formValue: LoginFormValue): Observable<boolean> {
    return this.httpClient.get<Usuario[]>(`${environment.url}/usuarios`, {
      params: { ...formValue }
    })
      .pipe(
        map((usuarios) => {
          const usuarioAutenticado = usuarios[0];
          if (usuarioAutenticado) {
            if (usuarioAutenticado.token)
              localStorage.setItem('token', usuarioAutenticado.token);
            this.authUser$.next(usuarioAutenticado);
            this.router.navigate(['home']);
            return true;
          } else {
            return false;
          }
        }),
        catchError(() => {
          return of(false);
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
  }

}

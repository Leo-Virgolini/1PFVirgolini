import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.verificarToken()
      .pipe(
        map((usuarioAutenticado) => {
          if (usuarioAutenticado) {
            return this.router.createUrlTree(['home']);
          } else {
            return true;
          }
        })
      );
  }

}

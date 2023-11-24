import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/core/models/usuario';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usuario: Usuario | null;

  constructor(private authService: AuthService) {
    this.usuario = null;
  }

  ngOnInit(): void {
    this.authService.obtenerUsuarioAutenticado().subscribe((usuario) => {
      if (usuario)
        this.usuario = usuario;
    });
  }

  logout(): void {
    this.authService.logout();
  }

}

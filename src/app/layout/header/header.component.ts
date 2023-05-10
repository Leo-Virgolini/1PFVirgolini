import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(private authService: AuthService) {
    authService.obtenerUsuarioAutenticado().subscribe((usuario) => usuario ? this.loggedIn = true : this.loggedIn = false);
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
  }

}

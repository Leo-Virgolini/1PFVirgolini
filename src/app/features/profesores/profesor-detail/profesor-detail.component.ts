import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profesor } from 'src/app/core/models/profesor';
import { ProfesorService } from 'src/app/core/services/profesor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profesor-detail',
  templateUrl: './profesor-detail.component.html',
  styleUrls: ['./profesor-detail.component.scss']
})
export class ProfesorDetailsComponent implements OnInit {

  profesor!: Profesor | null;
  loading: boolean;

  constructor(private readonly route: ActivatedRoute, private profesorService: ProfesorService, private _location: Location) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.profesorService.obtenerProfesor(parseInt(params['id']))?.subscribe((profesor) => {
      this.profesor = profesor;
      this.loading = false;
    }));
  }

  volver() {
    this._location.back();
  }

}

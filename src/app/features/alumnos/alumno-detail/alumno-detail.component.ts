import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Location } from '@angular/common';
import { Alumno } from 'src/app/core/models/alumno';

@Component({
  selector: 'app-alumno-detail',
  templateUrl: './alumno-detail.component.html',
  styleUrls: ['./alumno-detail.component.scss']
})
export class AlumnoDetailsComponent implements OnInit {

  alumno!: Alumno;
  loading: boolean;

  constructor(private readonly route: ActivatedRoute, private alumnoService: AlumnoService, private _location: Location) {
    this.loading = true;
    this.route.params.subscribe((params) => alumnoService.obtenerAlumno(parseInt(params['id']))?.subscribe((alumno) => {
      this.alumno = alumno;
      this.loading = false;
    }));
  }

  ngOnInit(): void {
  }

  volver() {
    this._location.back();
  }

}

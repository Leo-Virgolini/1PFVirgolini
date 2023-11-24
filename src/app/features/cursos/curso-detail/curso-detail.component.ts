import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/core/models/curso';
import { CursoService } from 'src/app/core/services/curso.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-curso-detail',
  templateUrl: './curso-detail.component.html',
  styleUrls: ['./curso-detail.component.scss']
})
export class CursoDetailsComponent implements OnInit {

  curso!: Curso;
  loading: boolean;

  constructor(private readonly route: ActivatedRoute, private cursoService: CursoService, private _location: Location) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.cursoService.obtenerCurso(parseInt(params['id']))?.subscribe((curso) => {
      this.curso = curso;
      this.loading = false;
    }));
  }

  volver() {
    this._location.back();
  }

}

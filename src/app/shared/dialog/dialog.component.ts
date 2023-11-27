import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  datos: string | undefined;
  titulo: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data?.alumno) {
      this.titulo = "ALUMNO";
      this.datos = this.data.alumno.id + " - " + this.data.alumno.apellido + ", " + this.data.alumno.nombre;
    } else if (this.data?.profesor) {
      this.titulo = "PROFESOR";
      this.datos = this.data.profesor.id + " - " + this.data.profesor.apellido + ", " + this.data.profesor.nombre;
    } else if (this.data?.curso) {
      this.titulo = "CURSO";
      this.datos = this.data.curso.id + " - " + this.data.curso.materia;
    } else if (this.data?.inscripcion) {
      this.titulo = "INSCRIPCION";
      this.datos = this.data.inscripcion.id + " - " + this.data.inscripcion.alumno.apellido + ", " + this.data.inscripcion.alumno.nombre + " - " + this.data.inscripcion.curso.materia;
    }
  }

}

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
      this.datos = "ID: " + this.data.alumno.id + " APELLIDO: " + this.data.alumno.apellido + " NOMBRE:" + this.data.alumno.nombre;
    } else if (this.data?.profesor) {
      this.titulo = "PROFESOR";
      this.datos = "ID: " + this.data.id + " APELLIDO: " + this.data.apellido + " NOMBRE:" + this.data.nombre;
    } else if (this.data?.curso) {
      this.titulo = "CURSO";
      this.datos = "ID: " + this.data.id + " MATERIA: " + this.data.materia;
    } else if (this.data?.inscripcion) {
      this.titulo = "INSCRIPCION";
      this.datos = "ID: " + this.data.id + " ALUMNO: " + this.data.alumno + " CURSO:" + this.data.curso;
    }
  }

}

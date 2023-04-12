import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alumno } from 'src/app/core/models/alumno';
import { alumnos } from '../alumnos';


@Component({
  selector: 'app-alumno-dialog',
  templateUrl: './alumno-dialog.component.html',
  styleUrls: ['./alumno-dialog.component.scss']
})
export class AlumnoDialogComponent implements OnInit, OnDestroy {

  public submitted: boolean;

  public formulario: FormGroup;
  public nombre: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
  public apellido: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
  public fechaNacimiento: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);

  public alumnoId!: number;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AlumnoDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Alumno | null) {
    this.submitted = false;

    this.formulario = this.formBuilder.group({
      nombre: this.nombre,
      apellido: this.apellido,
      fechaNacimiento: this.fechaNacimiento
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.alumnoId = this.data.id;
      this.nombre?.patchValue(this.data.nombre);
      this.apellido?.patchValue(this.data.apellido);
      this.fechaNacimiento?.patchValue(new Date(this.data.fechaNacimiento));
    }
  }

  ngOnDestroy(): void {
  }

  public onSubmit(): void {
    this.formulario.markAllAsTouched();
    this.submitted = true;
    if (this.formulario.valid) {
      console.log(this.formulario.value);
      console.log(this.data);
      if (this.data) { // Modificacion
        const alumno: Alumno = this.data;
        if (alumno) {
          alumno.nombre = this.nombre?.value;
          alumno.apellido = this.apellido?.value;
          alumno.fechaNacimiento = this.fechaNacimiento?.value;
          const index = alumnos.findIndex(al => al.id === alumno.id);
          if (index != -1)
            alumnos[index] = alumno;
          console.log("modificado: ", alumno);
          this.dialogRef.close(alumno);
        }
      } else { // Alta
        let ultimoId: number;
        if (alumnos.length > 0)
          ultimoId = Number(alumnos[alumnos.length - 1].id);
        else
          ultimoId = 0;
        const alumno: Alumno = new Alumno(ultimoId + 1,
          this.nombre?.value,
          this.apellido?.value,
          this.fechaNacimiento?.value,
        );
        alumnos.push(alumno);
        console.log("alta: ", alumno);
        this.dialogRef.close(alumno);
      }
    }
  }

}

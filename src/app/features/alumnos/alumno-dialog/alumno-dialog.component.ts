import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { alumnosData } from 'src/app/core/data';
import { Alumno } from 'src/app/core/models/alumno';
import { AlumnoService } from 'src/app/core/services/alumno.service';

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

  constructor(private alumnoService: AlumnoService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AlumnoDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Alumno | null) {
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
          this.alumnoService.modificarAlumno(alumno).subscribe({
            next: (al) => console.log("modificado: ", al),
            complete: () => this.dialogRef.close(alumno),
            error: (error) => console.log(error)
          });
        }
      } else { // Alta
        let ultimoId: number;
        if (alumnosData.length > 0)
          ultimoId = Number(alumnosData[alumnosData.length - 1].id);
        else
          ultimoId = 0;
        const alumno: Alumno = new Alumno(ultimoId + 1,
          this.nombre?.value,
          this.apellido?.value,
          this.fechaNacimiento?.value,
          'dni',
          'provincia',
          'localidad',
          'calle',
          'email',
          'password'
        );
        this.alumnoService.altaAlumno(alumno).subscribe({
          next: (al) => console.log("alta: ", al),
          complete: () => this.dialogRef.close(alumno),
          error: (error) => console.log(error)
        });
      }
    }
  }

}

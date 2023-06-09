import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Profesor } from 'src/app/core/models/profesor';
import { ProfesorService } from 'src/app/core/services/profesor.service';

@Component({
  selector: 'app-profesor-dialog',
  templateUrl: './profesor-dialog.component.html',
  styleUrls: ['./profesor-dialog.component.scss']
})
export class ProfesorDialogComponent implements OnInit, OnDestroy {

  public formulario!: FormGroup;
  public submitted: boolean;
  private subscriptions!: Subscription[];

  public profesorId!: number;

  constructor(private profesorService: ProfesorService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<ProfesorDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Profesor | null) {
    this.submitted = false;
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]],
      fechaNacimiento: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(6), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]],
      repeatPassword: ['', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]]
    },
      { validators: [this.passwordsMatchValidator()] }
    );
    console.log(this.data);
    if (this.data) {
      this.profesorId = this.data.id;
      this.formulario.get('nombre')?.patchValue(this.data.nombre);
      this.formulario.get('apellido')?.patchValue(this.data.apellido);
      this.formulario.get('fechaNacimiento')?.patchValue(new Date(this.data.fechaNacimiento));
      this.formulario.get('dni')?.patchValue(this.data.dni);
      this.formulario.get('email')?.patchValue(this.data.email);
      this.formulario.get('password')?.patchValue(this.data.password);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onSubmit(): void {
    this.formulario.markAllAsTouched();
    this.submitted = true;
    if (this.formulario.valid) {
      console.log(this.formulario.value);
      console.log(this.data);
      if (this.data) { // Modificacion
        this.modificarProfesor();
      } else { // Alta
        this.altaProfesor();
      }
    }
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.formulario?.controls['password']?.value !== this.formulario?.controls['repeatPassword']?.value)
        return {
          passwordMismatch: true
        }
      return null;
    }
  }

  private modificarProfesor(): void {
    const profesor: Profesor | null = this.data;
    if (profesor) {
      profesor.nombre = this.formulario.get('nombre')?.value;
      profesor.apellido = this.formulario.get('apellido')?.value;
      profesor.fechaNacimiento = this.formulario.get('fechaNacimiento')?.value;
      profesor.dni = this.formulario.get('dni')?.value;
      profesor.email = this.formulario.get('email')?.value;
      profesor.password = this.formulario.get('password')?.value;
      this.subscriptions.push(this.profesorService.modificarProfesor(profesor).subscribe({
        next: (p) => console.log("modificado: ", p),
        complete: () => this.dialogRef.close(profesor),
        error: (error) => console.log(error)
      }));
    }
  }

  private altaProfesor(): void {
    let profesor: Profesor = new Profesor(0,
      this.formulario.get('nombre')?.value,
      this.formulario.get('apellido')?.value,
      this.formulario.get('fechaNacimiento')?.value,
      this.formulario.get('dni')?.value,
      this.formulario.get('email')?.value,
      this.formulario.get('password')?.value,
      "profesor"
    );
    this.subscriptions.push(this.profesorService.altaProfesor(profesor).subscribe((value) => {
      this.dialogRef.close(value);
    }));
  }

}

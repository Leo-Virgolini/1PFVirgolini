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

  private subscriptions!: Subscription[];
  public formulario!: FormGroup;
  public submitted: boolean;
  public profesorId!: number;

  constructor(private profesorService: ProfesorService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<ProfesorDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Profesor | null) {
    this.submitted = false;
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nombreControl: ['', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]],
      apellidoControl: ['', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]],
      fechaNacimientoControl: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      dniControl: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(6), Validators.maxLength(10)]],
      emailControl: ['', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]],
      passwordControl: ['', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]],
      repeatPasswordControl: ['', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]]
    },
      { validators: [this.passwordsMatchValidator()] }
    );
    console.log(this.data);
    if (this.data) {
      this.profesorId = this.data.id;
      this.formulario.get('nombreControl')?.patchValue(this.data.nombre);
      this.formulario.get('apellidoControl')?.patchValue(this.data.apellido);
      this.formulario.get('fechaNacimientoControl')?.patchValue(new Date(this.data.fechaNacimiento));
      this.formulario.get('dniControl')?.patchValue(this.data.dni);
      this.formulario.get('emailControl')?.patchValue(this.data.email);
      this.formulario.get('passwordControl')?.patchValue(this.data.password);
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
      if (this.formulario?.controls['passwordControl']?.value !== this.formulario?.controls['repeatPasswordControl']?.value)
        return {
          passwordMismatch: true
        }
      return null;
    }
  }

  private modificarProfesor(): void {
    const profesor: Profesor | null = this.data;
    if (profesor) {
      profesor.nombre = this.formulario.get('nombreControl')?.value;
      profesor.apellido = this.formulario.get('apellidoControl')?.value;
      profesor.fechaNacimiento = this.formulario.get('fechaNacimientoControl')?.value;
      profesor.dni = this.formulario.get('dniControl')?.value;
      profesor.email = this.formulario.get('emailControl')?.value;
      profesor.password = this.formulario.get('passwordControl')?.value;
      this.subscriptions.push(this.profesorService.modificarProfesor(profesor).subscribe({
        next: (p) => console.log("modificado: ", p),
        complete: () => this.dialogRef.close(profesor),
        error: (err) => this.dialogRef.close(err)
      }));
    }
  }

  private altaProfesor(): void {
    let profesor: Profesor = new Profesor(0,
      this.formulario.get('nombreControl')?.value,
      this.formulario.get('apellidoControl')?.value,
      this.formulario.get('fechaNacimientoControl')?.value,
      this.formulario.get('dniControl')?.value,
      this.formulario.get('emailControl')?.value,
      this.formulario.get('passwordControl')?.value,
      "profesor"
    );
    this.subscriptions.push(this.profesorService.altaProfesor(profesor).subscribe({
      next: (p) => { profesor.id = p.id; console.log("alta: ", p) },
      complete: () => this.dialogRef.close(profesor),
      error: (err) => this.dialogRef.close(err)
    }));
  }

}

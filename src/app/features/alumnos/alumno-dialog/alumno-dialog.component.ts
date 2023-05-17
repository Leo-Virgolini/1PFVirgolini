import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Alumno } from 'src/app/core/models/alumno';
import { AlumnoService } from 'src/app/core/services/alumno.service';

@Component({
  selector: 'app-alumno-dialog',
  templateUrl: './alumno-dialog.component.html',
  styleUrls: ['./alumno-dialog.component.scss']
})
export class AlumnoDialogComponent implements OnInit, OnDestroy {

  readonly provinciasList: string[] = [
    'Buenos Aires',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán'
  ];

  public submitted: boolean;
  private subscriptions!: Subscription[];

  public formulario: FormGroup;
  public nombre: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
  public apellido: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
  public fechaNacimiento: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public dni: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(6), Validators.maxLength(10)]);
  public provincia: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
  public localidad: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú0-9 ]+$'), Validators.minLength(4), Validators.maxLength(20)]);
  public calle: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú0-9 ]+$'), Validators.minLength(4), Validators.maxLength(32)]);
  public email: FormControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]);
  public password: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
  public repeatPassword: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);

  public alumnoId!: number;

  constructor(private alumnoService: AlumnoService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AlumnoDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Alumno | null) {
    this.submitted = false;
    this.subscriptions = [];

    this.formulario = this.formBuilder.group({
      nombre: this.nombre,
      apellido: this.apellido,
      fechaNacimiento: this.fechaNacimiento,
      dni: this.dni,
      direccion: this.formBuilder.group({
        provincia: this.provincia,
        localidad: this.localidad,
        calle: this.calle
      }),
      email: this.email,
      password: this.password,
      repeatPassword: this.repeatPassword
    },
      { validators: [this.passwordsMatchValidator()] });
  }

  ngOnInit(): void {
    if (this.data) {
      this.alumnoId = this.data.id;
      this.nombre?.patchValue(this.data.nombre);
      this.apellido?.patchValue(this.data.apellido);
      this.fechaNacimiento?.patchValue(new Date(this.data.fechaNacimiento));
      this.dni?.patchValue(this.data.dni);
      this.provincia?.patchValue(this.data.provincia);
      this.localidad?.patchValue(this.data.localidad);
      this.calle?.patchValue(this.data.calle);
      this.email?.patchValue(this.data.email);
      this.password?.patchValue(this.data.password);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onSubmit(): void {
    this.formulario.markAllAsTouched();
    this.submitted = true;
    if (this.formulario.valid) {
      console.log(this.data);
      if (this.data) { // Modificacion
        this.modificarAlumno();
      } else { // Alta
        this.altaAlumno();
      }
    }
  }

  private modificarAlumno(): void {
    const alumno: Alumno | null = this.data;
    if (alumno) {
      alumno.nombre = this.nombre?.value;
      alumno.apellido = this.apellido?.value;
      alumno.fechaNacimiento = this.fechaNacimiento?.value;
      alumno.dni = this.dni?.value;
      alumno.provincia = this.provincia?.value;
      alumno.localidad = this.localidad?.value;
      alumno.calle = this.calle?.value;
      alumno.email = this.email?.value;
      alumno.password = this.password?.value;
      alumno.rol = "alumno";
      this.subscriptions.push(this.alumnoService.modificarAlumno(alumno).subscribe({
        next: (al) => console.log("modificado: ", al),
        complete: () => this.dialogRef.close(alumno),
        error: (error) => console.log(error)
      }));
    }
  }

  private altaAlumno(): void {

    const alumno: Alumno = new Alumno(0,
      this.nombre?.value,
      this.apellido?.value,
      this.fechaNacimiento?.value,
      this.dni?.value,
      this.provincia?.value,
      this.localidad?.value,
      this.calle?.value,
      this.email?.value,
      this.password?.value,
      "alumno"
    );
    this.subscriptions.push(this.alumnoService.altaAlumno(alumno).subscribe({
      next: (al) => console.log("alta: ", al),
      complete: () => this.dialogRef.close(alumno),
      error: (error) => console.log(error)
    }));
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.password?.value !== this.repeatPassword?.value)
        return {
          passwordMismatch: true
        }
      return null;
    }
  }

}

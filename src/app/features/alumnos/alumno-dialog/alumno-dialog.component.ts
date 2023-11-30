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

  public readonly provinciasList: string[] = [
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

  private subscriptions: Subscription[];
  public alumnoId!: number;
  public submitted: boolean;

  public formulario: FormGroup;
  public nombreControl: FormControl;
  public apellidoControl: FormControl;
  public fechaNacimientoControl: FormControl;
  public dniControl: FormControl;
  public provinciaControl: FormControl;
  public localidadControl: FormControl;
  public calleControl: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;
  public repeatPasswordControl: FormControl;

  constructor(private alumnoService: AlumnoService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AlumnoDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Alumno | null) {
    this.submitted = false;
    this.subscriptions = [];

    this.nombreControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
    this.apellidoControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
    this.fechaNacimientoControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    this.dniControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(6), Validators.maxLength(10)]);
    this.provinciaControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]);
    this.localidadControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú0-9 ]+$'), Validators.minLength(4), Validators.maxLength(20)]);
    this.calleControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú0-9 ]+$'), Validators.minLength(4), Validators.maxLength(32)]);
    this.emailControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
    this.repeatPasswordControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);

    this.formulario = this.formBuilder.group({
      nombreControl: this.nombreControl,
      apellidoControl: this.apellidoControl,
      fechaNacimientoControl: this.fechaNacimientoControl,
      dniControl: this.dniControl,
      direccionGroup: this.formBuilder.group({
        provinciaControl: this.provinciaControl,
        localidadControl: this.localidadControl,
        calleControl: this.calleControl
      }),
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      repeatPasswordControl: this.repeatPasswordControl
    },
      { validators: [this.passwordsMatchValidator()] });
  }

  ngOnInit(): void {
    if (this.data) {
      this.alumnoId = this.data.id;
      this.nombreControl?.patchValue(this.data.nombre);
      this.apellidoControl?.patchValue(this.data.apellido);
      this.fechaNacimientoControl?.patchValue(new Date(this.data.fechaNacimiento));
      this.dniControl?.patchValue(this.data.dni);
      this.provinciaControl?.patchValue(this.data.provincia);
      this.localidadControl?.patchValue(this.data.localidad);
      this.calleControl?.patchValue(this.data.calle);
      this.emailControl?.patchValue(this.data.email);
      this.passwordControl?.patchValue(this.data.password);
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
      alumno.nombre = this.nombreControl?.value;
      alumno.apellido = this.apellidoControl?.value;
      alumno.fechaNacimiento = this.fechaNacimientoControl?.value;
      alumno.dni = this.dniControl?.value;
      alumno.provincia = this.provinciaControl?.value;
      alumno.localidad = this.localidadControl?.value;
      alumno.calle = this.calleControl?.value;
      alumno.email = this.emailControl?.value;
      alumno.password = this.passwordControl?.value;
      alumno.rol = "alumno";
      this.subscriptions.push(this.alumnoService.modificarAlumno(alumno).subscribe({
        next: (al) => console.log("modificado: ", al),
        complete: () => this.dialogRef.close(alumno),
        error: (err) => this.dialogRef.close(err)
      }));
    }
  }

  private altaAlumno(): void {
    const alumno: Alumno = new Alumno(0,
      this.nombreControl?.value,
      this.apellidoControl?.value,
      this.fechaNacimientoControl?.value,
      this.dniControl?.value,
      this.provinciaControl?.value,
      this.localidadControl?.value,
      this.calleControl?.value,
      this.emailControl?.value,
      this.passwordControl?.value,
      "alumno"
    );
    this.subscriptions.push(this.alumnoService.altaAlumno(alumno).subscribe({
      next: (al) => alumno.id = al.id,
      complete: () => this.dialogRef.close(alumno),
      error: (err) => this.dialogRef.close(err)
    }));
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.passwordControl?.value !== this.repeatPasswordControl?.value)
        return {
          passwordMismatch: true
        }
      return null;
    }
  }

}

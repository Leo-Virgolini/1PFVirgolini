import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Alumno } from 'src/app/core/models/alumno';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

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

  constructor(private alumnoService: AlumnoService, private formBuilder: FormBuilder, private router: Router) {
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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onSubmit(): void {
    this.formulario.markAllAsTouched();
    this.submitted = true;
    if (this.formulario.valid) {
      this.altaAlumno();
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
      complete: () => this.router.navigate(['home']),
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

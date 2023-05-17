import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/core/models/usuario';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent implements OnInit, OnDestroy {

  readonly roles: string[] = [
    'admin',
    'profesor',
    'alumno'
  ];

  public submitted: boolean;
  private subscriptions!: Subscription[];

  public formulario: FormGroup;
  public email: FormControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]);
  public password: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
  public repeatPassword: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
  public rol: FormControl = new FormControl('', [Validators.required]);
  // public token: FormControl = new FormControl('', [Validators.required]);

  public usuarioId!: number;

  constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<UsuarioDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Usuario | null) {
    this.submitted = false;
    this.subscriptions = [];

    this.formulario = this.formBuilder.group({
      email: this.email,
      password: this.password,
      repeatPassword: this.repeatPassword,
      rol: this.rol,
      // token: this.token
    },
      { validators: [this.passwordsMatchValidator()] });
  }

  ngOnInit(): void {
    if (this.data) {
      this.usuarioId = this.data.id;
      this.email?.patchValue(this.data.email);
      this.password?.patchValue(this.data.password);
      this.rol?.patchValue(this.data.rol);
      // this.token?.patchValue(this.data.token);
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
        this.modificarUsuario();
      } else { // Alta
        this.altaUsusario();
      }
    }
  }

  private modificarUsuario(): void {
    const usuario: Usuario | null = this.data;
    if (usuario) {
      usuario.email = this.email?.value;
      usuario.password = this.password?.value;
      usuario.rol = this.rol?.value;
      // usuario.token = this.token?.value;

      this.subscriptions.push(this.usuarioService.modificarUsuario(usuario).subscribe({
        next: (u) => console.log("modificado: ", u),
        complete: () => this.dialogRef.close(usuario),
        error: (error) => console.log(error)
      }));
    }
  }

  private altaUsusario(): void {

    const usuario: Usuario = new Usuario(0,
      this.email?.value,
      this.password?.value,
      this.rol?.value,
      // this.token?.value
    );
    this.subscriptions.push(this.usuarioService.altaUsuario(usuario).subscribe({
      next: (u) => console.log("alta: ", u),
      complete: () => this.dialogRef.close(usuario),
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

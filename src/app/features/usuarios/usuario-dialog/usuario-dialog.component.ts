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
  public emailControl: FormControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]);
  public passwordControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
  public repeatPasswordControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
  public rolControl: FormControl = new FormControl('', [Validators.required]);

  public usuarioId!: number;

  constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<UsuarioDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Usuario | null) {
    this.submitted = false;
    this.subscriptions = [];

    this.formulario = this.formBuilder.group({
      email: this.emailControl,
      password: this.passwordControl,
      repeatPassword: this.repeatPasswordControl,
      rol: this.rolControl,
      // token: this.token
    },
      { validators: [this.passwordsMatchValidator()] });
  }

  ngOnInit(): void {
    if (this.data) {
      this.usuarioId = this.data.id;
      this.emailControl?.patchValue(this.data.email);
      this.passwordControl?.patchValue(this.data.password);
      this.rolControl?.patchValue(this.data.rol);
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
      usuario.email = this.emailControl?.value;
      usuario.password = this.passwordControl?.value;
      usuario.rol = this.rolControl?.value;
      // usuario.token = this.token?.value;

      this.subscriptions.push(this.usuarioService.modificarUsuario(usuario).subscribe({
        next: (u) => console.log("modificado: ", u),
        complete: () => this.dialogRef.close(usuario),
        error: (error) => console.log(error)
      }));
    }
  }

  private altaUsusario(): void {

    const token: string = this.generateRandomToken(32);

    const usuario: Usuario = new Usuario(0,
      this.emailControl?.value,
      this.passwordControl?.value,
      this.rolControl?.value,
      token
    );
    this.subscriptions.push(this.usuarioService.altaUsuario(usuario).subscribe({
      next: (u) => { usuario.id = u.id; console.log("alta: ", u) },
      complete: () => this.dialogRef.close(usuario),
      error: (error) => this.dialogRef.close(error)
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

  private generateRandomToken(length: number): string {
    const array = new Uint32Array(Math.ceil(length / 2));
    crypto.getRandomValues(array);

    return Array.from(array, dec => dec.toString(16)).join('').slice(0, length);
  }

}

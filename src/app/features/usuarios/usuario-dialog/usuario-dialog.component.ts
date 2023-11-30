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

  public readonly roles: string[] = [
    'admin',
    'profesor',
    'alumno'
  ];

  private subscriptions: Subscription[];
  public usuarioId!: number;
  public submitted: boolean;

  public formulario: FormGroup;
  public emailControl: FormControl;
  public passwordControl: FormControl;
  public repeatPasswordControl: FormControl;
  public rolControl: FormControl;

  constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<UsuarioDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Usuario | null) {
    this.submitted = false;
    this.subscriptions = [];

    this.emailControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]);
    this.passwordControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
    this.repeatPasswordControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
    this.rolControl = new FormControl('', [Validators.required]);

    this.formulario = this.formBuilder.group({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      repeatPasswordControl: this.repeatPasswordControl,
      rolControl: this.rolControl,
    },
      { validators: [this.passwordsMatchValidator()] });
  }

  ngOnInit(): void {
    if (this.data) {
      this.usuarioId = this.data.id;
      this.emailControl?.patchValue(this.data.email);
      this.passwordControl?.patchValue(this.data.password);
      this.rolControl?.patchValue(this.data.rol);
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

      this.subscriptions.push(this.usuarioService.modificarUsuario(usuario).subscribe({
        next: (u) => console.log("modificado: ", u),
        complete: () => this.dialogRef.close(usuario),
        error: (err) => this.dialogRef.close(err)
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
      next: (u) => usuario.id = u.id,
      complete: () => this.dialogRef.close(usuario),
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

  private generateRandomToken(length: number): string {
    const array = new Uint32Array(Math.ceil(length / 2));
    crypto.getRandomValues(array);

    return Array.from(array, dec => dec.toString(16)).join('').slice(0, length);
  }

}

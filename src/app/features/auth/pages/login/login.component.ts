import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginFormValue } from '../../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public emailControl: FormControl = new FormControl('', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(64)]);
  public passwordControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[0-9])(?=.*?[a-zA-Z])[a-zA-Z0-9]+$'), Validators.minLength(4), Validators.maxLength(20)]);
  public loginForm: FormGroup;

  public success: boolean;
  public submitted: boolean;
  public hide: boolean = true;


  constructor(private authService: AuthService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.success = false;
    this.submitted = false;

    this.loginForm = this.formBuilder.group({
      email: this.emailControl,
      password: this.passwordControl
    });
    console.log(this.activatedRoute.snapshot);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.authService.login(this.loginForm.value as LoginFormValue).subscribe((success) => this.success = success);
    }
  }

}

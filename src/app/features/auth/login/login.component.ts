import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginFormValue } from '../../../core/services/auth.service';
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

  public success: boolean | null;
  public submitted: boolean;
  public error: boolean;
  public logout: string | null;
  public hide: boolean = true;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.success = null;
    this.submitted = false;
    this.error = false;

    this.loginForm = this.formBuilder.group({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl
    });

    this.logout = this.activatedRoute.snapshot.queryParamMap.get('logout');
  }

  onSubmit(): void {
    this.logout = null;
    this.submitted = true;
    this.success = null;
    this.error = false;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.authService.login(this.loginForm.value as LoginFormValue).subscribe(
        {
          next: (success) => {
            console.log("next");
            this.submitted = true;
            this.success = success;
          },
          error: (error) => {
            console.log("error");
            this.error = true;
            this.success = false;
          },
          complete: () => {
            console.log("complete");
          }
        }
      );
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.submitted = false;
      this.success = null;
      this.error = false;
    }
  }

}

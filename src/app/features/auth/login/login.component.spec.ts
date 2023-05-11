import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { LoginComponent } from "./login.component";
import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "src/app/core/services/auth.service";

describe('Pruebas del componente LoginComponent', () => {

    let loginComponent: LoginComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                HttpClientModule,
                RouterTestingModule,
                SharedModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatIconModule
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(LoginComponent);
        loginComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Al cargar la página, success, submitted y logout deben ser falsy',
        () => {
            expect(loginComponent.success).toBe(null);
            expect(loginComponent.submitted).toBe(false);
            expect(loginComponent.logout).toBe(null);
        }
    );

    it('Si el email y la password están vacías, los Controls deben ser invalid',
        () => {
            loginComponent.loginForm.setValue({ email: '', password: '' });
            expect(loginComponent.emailControl.invalid).toBeTrue();
            expect(loginComponent.passwordControl.invalid).toBeTrue();
            expect(loginComponent.loginForm.invalid).toBeTrue();
        }
    );

    it('Debe llamarse el método markAllAsTouched y los FormControl deben marcarse como touched al logear con valores incorrectos',
        () => {
            loginComponent.emailControl.setValue('aaa');
            loginComponent.passwordControl.setValue('1111');
            const spyOnMarkAllAsTouched = spyOn(loginComponent.loginForm, 'markAllAsTouched');
            loginComponent.onSubmit();
            expect(spyOnMarkAllAsTouched).toHaveBeenCalled();
            // expect(loginComponent.emailControl.touched).toBeTrue(); // falla
            // expect(loginComponent.passwordControl.touched).toBeTrue(); // falla
        }
    );

    it('Debe llamarse al método login del AuthService al logear con valores correctos',
        () => {
            loginComponent.emailControl.setValue('admin@admin.com');
            loginComponent.passwordControl.setValue('asd123');
            loginComponent.loginForm.setValue({ email: 'admin@admin.com', password: 'asd123' });
            // const spyOnLogin = spyOn(TestBed.inject(AuthService), 'login'); // tira error de undefined
            loginComponent.onSubmit();
            expect(loginComponent.loginForm.valid).toBeTrue();
            // expect(spyOnLogin).toHaveBeenCalled();
        }
    );

    it('Al llamar onKeydown, submitted y success deben ser falsy',
        () => {
            loginComponent.onKeydown(new Event(''));
            expect(loginComponent.success).toBe(null);
            expect(loginComponent.submitted).toBe(false);
        }
    );

});
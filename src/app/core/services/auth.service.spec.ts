import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginFormValue } from './auth.service';
import { Router } from '@angular/router';
import { skip } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from 'src/environments/environments.prod';
import { RouterTestingModule } from '@angular/router/testing';

describe('Pruebas sobre AuthService', () => {

    let service: AuthService;
    let httpController: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                AuthService
            ]
        }).compileComponents();

        service = TestBed.inject(AuthService);
        httpController = TestBed.inject(HttpTestingController);
    });

    it('Al logearse correctamente debe generarse un authUser y redireccionar a la home page',
        (done) => {

            const loginFake: LoginFormValue = {
                email: 'admin@admin.com',
                password: 'asd123'
            };

            const MOCK_REQUEST_RESULT: any[] = [
                {
                    id: 99,
                    email: loginFake.email,
                    password: loginFake.password,
                    rol: 'admin',
                    token: 'admin'
                }
            ];

            const spyOnNavigate = spyOn(TestBed.inject(Router), 'navigate');

            service
                .obtenerUsuarioAutenticado()
                .pipe(skip(1))
                .subscribe((usuario) => {
                    console.log("usuario", usuario);
                    console.log("mock", MOCK_REQUEST_RESULT[0]);
                    expect(usuario).toEqual(MOCK_REQUEST_RESULT[0]);
                    expect(spyOnNavigate).toHaveBeenCalled();
                    done();
                });

            service.login(loginFake);

            console.log('Intercepted Requests:', httpController.match({
                url: `${environment.url}/usuarios?email=${loginFake.email}&password=${loginFake.password}`,
                method: 'GET'
            }));

            httpController
                .expectOne({
                    url: `${environment.url}/usuarios?email=${loginFake.email}&password=${loginFake.password}`,
                    method: 'GET'
                })
                .flush(MOCK_REQUEST_RESULT);
        });

    it('El logout debe emitir un authUser null, remover el token del Localstorage y redireccionar al usuario',
        () => {

            const loginFake: LoginFormValue = {
                email: 'admin@admin.com',
                password: 'asd123'
            };

            const MOCK_REQUEST_RESULT: any[] = [
                {
                    id: 99,
                    email: loginFake.email,
                    password: loginFake.password,
                    rol: 'admin',
                    token: 'admin'
                }
            ];

            const spyOnNavigate = spyOn(TestBed.inject(Router), 'navigate');

            service.login(loginFake);

            httpController
                .expectOne({
                    url: `${environment.url}/usuarios?email=${loginFake.email}&password=${loginFake.password}`,
                    method: 'GET'
                })
                .flush(MOCK_REQUEST_RESULT);

            service.logout();

            const tokenLs = localStorage.getItem('token');

            expect(tokenLs).toBeNull();
            expect(spyOnNavigate).toHaveBeenCalled();
        });

});

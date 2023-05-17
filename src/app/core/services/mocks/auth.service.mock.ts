import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { Usuario } from 'src/app/core/models/usuario';
import { environment } from 'src/environments/environments.prod';

export interface LoginFormValue {
    email: string;
    password: string;
}


export class AuthServiceMock {

    private authUser$ = new BehaviorSubject<Usuario | null>(null);

    constructor() {
    }

    login(formValue: LoginFormValue): Observable<boolean> {
        this.authUser$.next(new Usuario(99, 'admin@admin.com', 'asd123', 'admin'));
        return of(true);
    }

}

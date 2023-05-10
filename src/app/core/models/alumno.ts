import { Usuario } from "./usuario";

export class Alumno extends Usuario {

    private _nombre: string;
    private _apellido: string;
    private _fechaNacimiento: Date;
    private _dni: string;
    private _provincia: string;
    private _localidad: string;
    private _calle: string;

    constructor(id: number, nombre: string, apellido: string, fechaNacimiento: Date, dni: string, provincia: string, localidad: string, calle: string, email: string, password: string, rol: string) {
        super(id, email, password, rol);
        this._nombre = nombre;
        this._apellido = apellido;
        this._fechaNacimiento = fechaNacimiento;
        this._dni = dni;
        this._provincia = provincia;
        this._localidad = localidad;
        this._calle = calle;
    }

    public get nombre(): string {
        return this._nombre;
    }
    public set nombre(value: string) {
        this._nombre = value;
    }

    public get apellido(): string {
        return this._apellido;
    }
    public set apellido(value: string) {
        this._apellido = value;
    }

    public get fechaNacimiento(): Date {
        return this._fechaNacimiento;
    }
    public set fechaNacimiento(value: Date) {
        this._fechaNacimiento = value;
    }

    public get dni(): string {
        return this._dni;
    }
    public set dni(value: string) {
        this._dni = value;
    }

    public get provincia(): string {
        return this._provincia;
    }
    public set provincia(value: string) {
        this._provincia = value;
    }

    public get localidad(): string {
        return this._localidad;
    }
    public set localidad(value: string) {
        this._localidad = value;
    }

    public get calle(): string {
        return this._calle;
    }
    public set calle(value: string) {
        this._calle = value;
    }

}

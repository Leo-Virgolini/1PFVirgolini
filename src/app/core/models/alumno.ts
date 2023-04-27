import { Usuario } from "./usuario";

export class Alumno extends Usuario {

    private _nombre: string;
    private _apellido: string;
    private _fechaNacimiento: Date;
    private _dni: string;
    private _provincia: string;
    private _localidad: string;
    private _calle: string;
    private _promedio: number;

    constructor(id: number, nombre: string, apellido: string, fechaNacimiento: Date, dni: string, provincia: string, localidad: string, calle: string, email: string, password: string) {
        super(id, email, password);
        this._nombre = nombre;
        this._apellido = apellido;
        this._fechaNacimiento = fechaNacimiento;
        this._dni = dni;
        this._provincia = provincia;
        this._localidad = localidad;
        this._calle = calle;
        this._promedio = Math.floor(Math.random() * (10 * 10 - 1 * 10) + 1 * 10) / (1 * 10);
    }


    public set nombre(nombre: string) {
        this._nombre = nombre;
    }

    public get nombre(): string {
        return this._nombre
    }

    public set apellido(apellido: string) {
        this._apellido = apellido;
    }

    public get apellido(): string {
        return this._apellido
    }

    public set fechaNacimiento(fechaNacimiento: Date) {
        this._fechaNacimiento = fechaNacimiento;
    }

    public get dni(): string {
        return this._dni;
    }

    public set dni(value: string) {
        this._dni = value;
    }

    public get fechaNacimiento(): Date {
        return this._fechaNacimiento
    }

    public set promedio(promedio: number) {
        this._promedio = promedio;
    }

    public get promedio(): number {
        return this._promedio
    }

    public get provincia(): string {
        return this._provincia;
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

    public set provincia(value: string) {
        this._provincia = value;
    }

    public calcularPromedio(): void {
        this._promedio = Math.floor(Math.random() * (10 * 10 - 1 * 10) + 1 * 10) / (1 * 10);
    }

}

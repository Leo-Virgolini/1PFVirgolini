import { Usuario } from "./usuario";

export class Profesor extends Usuario {

    private _nombre: string;
    private _apellido: string;
    private _fechaNacimiento: Date;
    private _dni: string;
    private _cursos: string | undefined;

    constructor(id: number, nombre: string, apellido: string, fechaNacimiento: Date, dni: string, email: string, password: string) {
        super(id, email, password);
        this._nombre = nombre;
        this._apellido = apellido;
        this._fechaNacimiento = fechaNacimiento;
        this._dni = dni;
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

    public get cursos(): string | undefined {
        return this._cursos;
    }
    public set cursos(value: string | undefined) {
        this._cursos = value;
    }

}

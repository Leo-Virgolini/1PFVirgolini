import { Usuario } from "./usuario";


export class Alumno extends Usuario {

    private _nombre: string;
    private _apellido: string;
    private _fechaNacimiento: Date;
    private _promedio: number;

    constructor(id: number, nombre: string, apellido: string, fechaNacimiento: Date) {
        super(id);
        this._nombre = nombre;
        this._apellido = apellido;
        this._fechaNacimiento = fechaNacimiento;
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

    public get fechaNacimiento(): Date {
        return this._fechaNacimiento
    }

    public set promedio(promedio: number) {
        this._promedio = promedio;
    }

    public get promedio(): number {
        return this._promedio
    }

    public calcularPromedio(): void {
        this._promedio = Math.floor(Math.random() * (10 * 10 - 1 * 10) + 1 * 10) / (1 * 10);
    }

}

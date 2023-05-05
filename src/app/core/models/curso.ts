import { Alumno } from "./alumno";
import { Profesor } from "./profesor";

export class Curso {

    private _id: number;
    private _materia: string;
    private _alumnos: Alumno[] | undefined;
    private _profesor: Profesor | undefined;

    constructor(id: number, materia: string, profesor?: Profesor, alumnos?: Alumno[]) {
        this._id = id;
        this._materia = materia;
        this._alumnos = alumnos;
        this._profesor = profesor;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get materia(): string {
        return this._materia;
    }
    public set materia(value: string) {
        this._materia = value;
    }

    public get alumnos(): Alumno[] | undefined {
        return this._alumnos;
    }
    public set alumnos(value: Alumno[] | undefined) {
        this._alumnos = value;
    }

    public get profesor(): Profesor | undefined {
        return this._profesor;
    }
    public set profesor(value: Profesor | undefined) {
        this._profesor = value;
    }

}

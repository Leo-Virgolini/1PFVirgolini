import { Alumno } from "./alumno";
import { Curso } from "./curso";

export class Inscripcion {

    private _id: number;
    private _idCurso: number;
    private _idAlumno: number;
    private _curso: Curso | undefined;
    private _alumno: Alumno | undefined;

    constructor(id: number, idCurso: number, idAlumno: number) {
        this._id = id;
        this._idCurso = idCurso;
        this._idAlumno = idAlumno;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get idCurso(): number {
        return this._idCurso;
    }
    public set idCurso(value: number) {
        this._idCurso = value;
    }

    public get idAlumno(): number {
        return this._idAlumno;
    }
    public set idAlumno(value: number) {
        this._idAlumno = value;
    }

    public get curso(): Curso | undefined {
        return this._curso;
    }
    public set curso(value: Curso | undefined) {
        this._curso = value;
    }

    public get alumno(): Alumno | undefined {
        return this._alumno;
    }
    public set alumno(value: Alumno | undefined) {
        this._alumno = value;
    }

}

import { Alumno } from "./alumno";
import { Curso } from "./curso";

export class Inscripcion {

    private _id: number;
    private _curso: Curso;
    private _alumno: Alumno;

    constructor(id: number, curso: Curso, alumno: Alumno) {
        this._id = id;
        this._curso = curso;
        this._alumno = alumno;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get curso(): Curso {
        return this._curso;
    }
    public set curso(value: Curso) {
        this._curso = value;
    }

    public get alumno(): Alumno {
        return this._alumno;
    }
    public set alumno(value: Alumno) {
        this._alumno = value;
    }

}

export class Inscripcion {

    private _id: number;
    private _idCurso: number;
    private _idAlumno: number;

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

}

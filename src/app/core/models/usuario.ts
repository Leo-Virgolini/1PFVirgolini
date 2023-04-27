export class Usuario {

    private _id: number;
    private _email: string;
    private _password: string;
    // private _rol: string;

    constructor(id: number, email: string, password: string) {
        this._id = id;
        this._email = email;
        this._password = password;
        // this._rol = rol;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    // public get rol(): string {
    //     return this._rol;
    // }
    // public set rol(value: string) {
    //     this._rol = value;
    // }

}

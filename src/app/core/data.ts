import { Alumno } from "./models/alumno";
import { Curso } from "./models/curso";
import { Inscripcion } from "./models/inscripcion";
import { Profesor } from "./models/profesor";
import { Usuario } from "./models/usuario";


export const usuariosData: Usuario[] = [
    new Usuario(1, 'jp@gmail.com', 'asd123'),
    new Usuario(2, 'tr@gmail.com', 'asd123'),
    new Usuario(3, 'cj@gmail.com', 'asd123'),
    new Usuario(4, 'mj@gmail.com', 'asd123'),
    new Usuario(5, 'mr@gmail.com', 'asd123'),
    new Usuario(6, 'ch@gmail.com', 'asd123'),
    new Usuario(7, 'sn@gmail.com', 'asd123'),
    new Usuario(8, 'fi@gmail.com', 'asd123'),
    new Usuario(9, 'rs@gmail.com', 'asd123'),
    new Usuario(10, 'pg@gmail.com', 'asd123'),
    new Usuario(11, 'rs@gmail.com', 'asd123'),
    new Usuario(12, 'rs@gmail.com', 'asd123'),
    new Usuario(13, 'rs@gmail.com', 'asd123'),
    new Usuario(14, 'rs@gmail.com', 'asd123'),
    new Usuario(15, 'rs@gmail.com', 'asd123'),
    new Usuario(16, 'rs@gmail.com', 'asd123'),
    new Usuario(17, 'rs@gmail.com', 'asd123'),
    new Usuario(18, 'rs@gmail.com', 'asd123'),
    new Usuario(19, 'rs@gmail.com', 'asd123'),
    new Usuario(20, 'rs@gmail.com', 'asd123'),
    new Usuario(21, 'rs@gmail.com', 'asd123'),
    new Usuario(22, 'rs@gmail.com', 'asd123'),
    new Usuario(23, 'rs@gmail.com', 'asd123'),
    new Usuario(24, 'rs@gmail.com', 'asd123'),
    new Usuario(25, 'rs@gmail.com', 'asd123')
];

export const alumnosData: Alumno[] = [
    new Alumno(1, 'Juan', 'Perez', new Date('1991/07/22'), '123456', 'Buenos Aires', 'Florida', 'Calle 4321', 'jp@gmail.com', 'asd123'),
    new Alumno(2, 'Tomás', 'Roncero', new Date('1985/08/11'), '362789156', 'Buenos Aires', 'San Isidro', 'Calle 4321', 'tr@gmail.com', 'asd123'),
    new Alumno(3, 'Carlos', 'Jimenez', new Date('1984/09/24'), '564321', 'Buenos Aires', 'Olivos', 'Calle 4321', 'cj@gmail.com', 'asd123'),
    new Alumno(4, 'Mateo', 'Juarez', new Date('1990/10/10'), '654123', 'Buenos Aires', 'Martinez', 'Calle 4321', 'mj@gmail.com', 'asd123'),
    new Alumno(5, 'Micaela', 'Ramirez', new Date('1991/11/05'), '115569', 'Buenos Aires', 'La Lucila', 'Calle 4321', 'mr@gmail.com', 'asd123'),
    new Alumno(6, 'Camila', 'Herrera', new Date('1992/12/07'), '945626', 'Buenos Aires', 'Munro', 'Calle 4321', 'ch@gmail.com', 'asd123'),
    new Alumno(7, 'Sofía', 'Narvaez', new Date('1986/01/19'), '1562236', 'Buenos Aires', 'La Matanza', 'Calle 4321', 'sn@gmail.com', 'asd123'),
    new Alumno(8, 'Fernando', 'Iglesias', new Date('1987/05/08'), '322356', 'Buenos Aires', 'San Miguel', 'Calle 4321', 'fi@gmail.com', 'asd123'),
    new Alumno(9, 'Romina', 'Sanchez', new Date('1984/04/17'), '945115', 'Buenos Aires', 'Berazategui', 'Calle 4321', 'rs@gmail.com', 'asd123'),
    new Alumno(10, 'Pedro', 'Gonzalez', new Date('1988/01/25'), '147963', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(11, 'Jorge', 'Quinteros', new Date('1990/01/25'), '4534534', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(12, 'Darío', 'Forlàn', new Date('1985/01/25'), '3242344', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(13, 'Agustín', 'Martinez', new Date('1987/01/25'), '6556664', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(14, 'Santiago', 'Schinini', new Date('1989/01/25'), '3322325', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(15, 'Pamela', 'Montiel', new Date('1984/01/25'), '658532', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(16, 'Josefina', 'Accuña', new Date('1991/01/25'), '533334', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(17, 'Macarena', 'Pereyra', new Date('1992/01/25'), '546097', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(18, 'Abigail', 'Molina', new Date('1991/01/25'), '874342', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(19, 'Jessica', 'Tagliafico', new Date('1994/01/25'), '426216', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123'),
    new Alumno(20, 'Fernando', 'Romero', new Date('1989/01/25'), '255789', 'Buenos Aires', 'Villa Ballester', 'Calle 4321', 'pg@gmail.com', 'asd123')
];

export const profesoresData: Profesor[] = [
    new Profesor(21, 'Fernando', 'Jordan', new Date('1977/07/22'), '354488', 'f@gmail.com', 'asd123'),
    new Profesor(22, 'Joaquín', 'James', new Date('1986/03/14'), '167754', 'j@gmail.com', 'asd123'),
    new Profesor(23, 'Josefina', 'Johnson', new Date('1984/07/07'), '546789', 'jj@gmail.com', 'asd123'),
    new Profesor(24, 'Mariana', 'Curry', new Date('1988/02/08'), '958451', 'mc@gmail.com', 'asd123'),
    new Profesor(25, 'Ramiro', 'Ramirez', new Date('1984/02/04'), '2523333', 'rr@gmail.com', 'asd123')
];

export const cursosData: Curso[] = [
    new Curso(1, 'Lengua', 21),
    new Curso(2, 'Biología', 22),
    new Curso(3, 'Física', 23),
    new Curso(4, 'Matemática', 24),
    new Curso(5, 'Geografía', 25),
    new Curso(6, 'Informática', 21),
    new Curso(7, 'Historia', 22)
    // new Curso(8, 'Química', 3),
    // new Curso(9, 'Derecho', 4),
    // new Curso(10, 'Filosofía', 5),
];

export const inscripcionesData: Inscripcion[] = [
    new Inscripcion(1, 1, 1),
    new Inscripcion(2, 2, 2),
    new Inscripcion(3, 3, 3),
    new Inscripcion(4, 4, 4),
    new Inscripcion(5, 5, 5),
    new Inscripcion(6, 6, 6),
    new Inscripcion(7, 7, 7),
    new Inscripcion(8, 1, 8),
    new Inscripcion(9, 2, 9),
    new Inscripcion(10, 3, 10),
    new Inscripcion(11, 4, 11),
    new Inscripcion(12, 5, 12),
    new Inscripcion(13, 6, 13),
    new Inscripcion(14, 7, 14),
    new Inscripcion(15, 1, 15),
    new Inscripcion(16, 2, 16),
    new Inscripcion(17, 3, 17),
    new Inscripcion(18, 4, 18),
    new Inscripcion(19, 5, 19),
    new Inscripcion(20, 6, 20),
    new Inscripcion(21, 7, 1),
    new Inscripcion(22, 1, 2),
    new Inscripcion(23, 2, 3),
    new Inscripcion(24, 3, 4),
    new Inscripcion(25, 4, 5),
    new Inscripcion(25, 5, 6),
    new Inscripcion(26, 6, 7),
    new Inscripcion(27, 7, 8),
    new Inscripcion(28, 1, 9),
    new Inscripcion(29, 2, 10),
    new Inscripcion(30, 3, 11),
    new Inscripcion(31, 4, 12),
    new Inscripcion(32, 5, 13),
    new Inscripcion(33, 6, 14),
    new Inscripcion(34, 7, 15),
    new Inscripcion(35, 1, 16),
    new Inscripcion(36, 2, 17),
    new Inscripcion(37, 3, 18),
    new Inscripcion(38, 4, 19),
    new Inscripcion(39, 5, 20),
    new Inscripcion(40, 6, 1),
    new Inscripcion(41, 7, 2),
    new Inscripcion(42, 1, 3),
    new Inscripcion(43, 2, 4),
    new Inscripcion(44, 3, 5),
    new Inscripcion(45, 4, 6),
    new Inscripcion(46, 5, 7),
    new Inscripcion(47, 6, 8),
    new Inscripcion(48, 7, 9),
    new Inscripcion(49, 1, 10),
    new Inscripcion(50, 2, 11)
];
import { Pipe, PipeTransform } from '@angular/core';
import { Alumno } from 'src/app/core/models/alumno';
import { Profesor } from 'src/app/core/models/profesor';

@Pipe({
  name: 'apellidoNombre',
  pure: false
})
export class NombreApellidoPipe implements PipeTransform {

  transform(value: Profesor | Alumno, ...args: unknown[]): string {
    return value.apellido + ', ' + value.nombre;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { Alumno } from '../../core/models/alumno';

@Pipe({
  name: 'nombreApellido',
  pure: false
})
export class NombreApellidoPipe implements PipeTransform {

  transform(value: Alumno, ...args: unknown[]): string {
    return value.apellido + ', ' + value.nombre;
  }

}

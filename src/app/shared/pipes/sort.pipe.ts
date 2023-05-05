import { Pipe, PipeTransform } from '@angular/core';
import { Alumno } from 'src/app/core/models/alumno';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: Alumno[], ...args: unknown[]): Alumno[] {
    return value.sort(function (a, b) {
      return a.id! - b.id!;
    });
  }

}

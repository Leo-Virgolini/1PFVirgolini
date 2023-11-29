import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'password'
})
export class PasswordPipe implements PipeTransform {

  transform(value: string, show: boolean, replaceChar?: string): string {
    if (value === undefined) {
      return value;
    }
    if (show) {
      return value;
    } else {
      if (replaceChar) {
        return replaceChar.repeat(value.length);
      }

      return '*'.repeat(value.length);
    }
  }

}

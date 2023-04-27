import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-helper',
  templateUrl: './error-helper.component.html',
  styleUrls: ['./error-helper.component.scss']
})
export class ErrorHelperComponent {

  @Input()
  control: FormControl | undefined;

}

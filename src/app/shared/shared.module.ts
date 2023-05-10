import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontSizeDirective } from './directives/font-size.directive';
import { NotFoundComponent } from './not-found/not-found.component';
import { NombreApellidoPipe } from './pipes/nombre-apellido.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorHelperComponent } from '../features/error-helper/error-helper.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    ErrorHelperComponent,
    NotFoundComponent,
    SpinnerComponent,
    NombreApellidoPipe,
    SortPipe,
    FontSizeDirective
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ErrorHelperComponent,
    NotFoundComponent,
    SpinnerComponent,
    NombreApellidoPipe,
    SortPipe,
    FontSizeDirective
  ]
})
export class SharedModule { }

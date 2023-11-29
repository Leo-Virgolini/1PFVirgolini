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
import { ErrorHelperComponent } from './error-helper/error-helper.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PasswordPipe } from './pipes/password.pipe';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ShowHidePasswordDirective } from './directives/show-hide-password.directive';

@NgModule({
  declarations: [
    ErrorHelperComponent,
    NotFoundComponent,
    SpinnerComponent,
    NombreApellidoPipe,
    SortPipe,
    PasswordPipe,
    FontSizeDirective,
    ShowHidePasswordDirective,
    DialogComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  exports: [
    ErrorHelperComponent,
    NotFoundComponent,
    SpinnerComponent,
    DialogComponent,
    NombreApellidoPipe,
    SortPipe,
    PasswordPipe,
    FontSizeDirective,
    ShowHidePasswordDirective
  ]
})
export class SharedModule { }

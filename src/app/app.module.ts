import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MenuComponent } from './layout/menu/menu.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AlumnosTableComponent } from './alumnos/alumno-table/alumno-table.component';
import { MainComponent } from './layout/main/main.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AlumnoDialogComponent } from './alumnos/alumno-dialog/alumno-dialog.component';
import { ErrorHelperComponent } from './error-helper/error-helper.component';
import { MatSortModule } from '@angular/material/sort';
import { NombreApellidoPipe } from './pipes/nombre-apellido.pipe';
import { FontSizeDirective } from './directives/font-size.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MainComponent,
    AlumnosTableComponent,
    AlumnoDialogComponent,
    SpinnerComponent,
    ErrorHelperComponent,
    NombreApellidoPipe,
    FontSizeDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-AR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import { MainComponent } from './layout/main/main.component';
import { MatSortModule } from '@angular/material/sort';
import { AppRoutingModule } from './app-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AlumnoDialogComponent } from './features/alumnos/alumno-dialog/alumno-dialog.component';
import { AlumnosTableComponent } from './features/alumnos/alumno-table/alumno-table.component';
import { CursoDialogComponent } from './features/cursos/curso-dialog/curso-dialog.component';
import { CursoTableComponent } from './features/cursos/curso-table/curso-table.component';
import { ErrorHelperComponent } from './features/error-helper/error-helper.component';
import { ProfesorDialogComponent } from './features/profesores/profesor-dialog/profesor-dialog.component';
import { ProfesorTableComponent } from './features/profesores/profesor-table/profesor-table.component';
import { FeaturesModule } from './features/features.module';
import { FontSizeDirective } from './shared/directives/font-size.directive';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { NombreApellidoPipe } from './shared/pipes/nombre-apellido.pipe';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MainComponent,
    AlumnosTableComponent,
    AlumnoDialogComponent,
    ProfesorTableComponent,
    ProfesorDialogComponent,
    CursoTableComponent,
    CursoDialogComponent,
    ErrorHelperComponent,
    NombreApellidoPipe,
    FontSizeDirective,
    NotFoundComponent,
    SpinnerComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    FeaturesModule,
    CoreModule,
    SharedModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-AR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

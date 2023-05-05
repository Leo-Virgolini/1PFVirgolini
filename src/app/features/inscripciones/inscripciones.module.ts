import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionTableComponent } from './inscripcion-table/inscripcion-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeaturesModule } from '../features.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InscripcionesRoutingModule } from './inscripciones-routing.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    InscripcionTableComponent
  ],
  imports: [
    CommonModule,
    InscripcionesRoutingModule,

    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,

    ReactiveFormsModule,
    FeaturesModule,
    SharedModule
  ]
})
export class InscripcionesModule { }

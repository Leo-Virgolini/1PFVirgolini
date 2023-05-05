import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesorDialogComponent } from './profesor-dialog/profesor-dialog.component';
import { ProfesorTableComponent } from './profesor-table/profesor-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FeaturesModule } from '../features.module';
import { ProfesoresRoutingModule } from './profesores-routing.module';
import { MatListModule } from '@angular/material/list';
import { ProfesorDetailsComponent } from './profesor-detail/profesor-detail.component';


@NgModule({
  declarations: [
    ProfesorTableComponent,
    ProfesorDialogComponent,
    ProfesorDetailsComponent
  ],
  imports: [
    CommonModule,
    ProfesoresRoutingModule,

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

    FeaturesModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ProfesoresModule { }

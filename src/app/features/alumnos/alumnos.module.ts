import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnoDialogComponent } from './alumno-dialog/alumno-dialog.component';
import { AlumnoTableComponent } from './alumno-table/alumno-table.component';
import { FeaturesModule } from '../features.module';
import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AlumnoDetailsComponent } from './alumno-detail/alumno-detail.component';

@NgModule({
  declarations: [
    AlumnoTableComponent,
    AlumnoDialogComponent,
    AlumnoDetailsComponent
  ],
  imports: [
    CommonModule,
    AlumnosRoutingModule,
    FeaturesModule
  ]
})
export class AlumnosModule { }

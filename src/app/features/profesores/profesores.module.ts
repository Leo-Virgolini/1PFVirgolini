import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesorDialogComponent } from './profesor-dialog/profesor-dialog.component';
import { ProfesorTableComponent } from './profesor-table/profesor-table.component';
import { FeaturesModule } from '../features.module';
import { ProfesoresRoutingModule } from './profesores-routing.module';
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
    FeaturesModule
  ]
})
export class ProfesoresModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionTableComponent } from './inscripcion-table/inscripcion-table.component';
import { FeaturesModule } from '../features.module';
import { InscripcionesRoutingModule } from './inscripciones-routing.module';

@NgModule({
  declarations: [
    InscripcionTableComponent
  ],
  imports: [
    CommonModule,
    InscripcionesRoutingModule,
    FeaturesModule
  ]
})
export class InscripcionesModule { }

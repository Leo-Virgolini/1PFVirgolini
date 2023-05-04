import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorHelperComponent } from './error-helper/error-helper.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeaturesRoutingModule } from './features-routing.module';

@NgModule({
  declarations: [
    ErrorHelperComponent
  ],
  imports: [
    CommonModule,
    // AlumnosModule,
    // CursosModule,
    // ProfesoresModule,
    // InscripcionesModule,
    FeaturesRoutingModule,

    MatIconModule,
    MatFormFieldModule,
    SharedModule,
  ],
  exports: [
    ErrorHelperComponent,
    RouterModule
  ]
})
export class FeaturesModule { }

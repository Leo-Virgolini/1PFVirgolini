import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoDialogComponent } from './curso-dialog/curso-dialog.component';
import { CursoTableComponent } from './curso-table/curso-table.component';
import { FeaturesModule } from '../features.module';
import { CursosRoutingModule } from './cursos-routing.module';
import { CursoDetailsComponent } from './curso-detail/curso-detail.component';

@NgModule({
  declarations: [
    CursoTableComponent,
    CursoDialogComponent,
    CursoDetailsComponent
  ],
  imports: [
    CommonModule,
    CursosRoutingModule,
    FeaturesModule
  ]
})
export class CursosModule { }

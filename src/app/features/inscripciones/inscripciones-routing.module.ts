import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InscripcionTableComponent } from './inscripcion-table/inscripcion-table.component';

const routes: Routes = [
  { path: '', component: InscripcionTableComponent },
  // { path: ':id', component: InscripcionDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InscripcionesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnoTableComponent } from './alumno-table/alumno-table.component';

const routes: Routes = [
  { path: '', component: AlumnoTableComponent },
  // { path: ':id', component: AlumnoDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AlumnosRoutingModule { }

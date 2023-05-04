import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfesorTableComponent } from './profesor-table/profesor-table.component';

const routes: Routes = [
  { path: '', component: ProfesorTableComponent },
  // { path: ':id', component: ProfesorDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProfesoresRoutingModule { }

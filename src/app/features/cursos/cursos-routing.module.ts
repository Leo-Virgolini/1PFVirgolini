import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursoTableComponent } from './curso-table/curso-table.component';

const routes: Routes = [
  { path: '', component: CursoTableComponent },
  // { path: ':id', component: CursoDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CursosRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioTableComponent } from './usuario-table/usuario-table.component';


const routes: Routes = [
  { path: '', component: UsuarioTableComponent },
  // { path: ':id', component: UsuarioDetailsComponent  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }

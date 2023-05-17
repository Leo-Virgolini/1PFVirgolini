import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesModule } from '../features.module';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuarioTableComponent } from './usuario-table/usuario-table.component';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';


@NgModule({
  declarations: [
    UsuarioTableComponent,
    UsuarioDialogComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FeaturesModule
  ]
})
export class UsuariosModule { }

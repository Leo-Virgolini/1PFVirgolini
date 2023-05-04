import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from '../layout/menu/menu.component';

const routes: Routes = [
  {
    path: '', component: MenuComponent,
    children: [
      { path: 'alumnos', loadChildren: () => import('./alumnos/alumnos.module').then((module) => module.AlumnosModule) },
      { path: 'profesores', loadChildren: () => import('./profesores/profesores.module').then((module) => module.ProfesoresModule) },
      { path: 'cursos', loadChildren: () => import('./cursos/cursos.module').then((module) => module.CursosModule) },
      { path: 'inscripciones', loadChildren: () => import('./inscripciones/inscripciones.module').then((module) => module.InscripcionesModule) }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }

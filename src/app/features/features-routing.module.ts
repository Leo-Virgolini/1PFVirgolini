import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';

const routes: Routes = [
  { // /home
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'alumnos', loadChildren: () => import('./alumnos/alumnos.module').then((module) => module.AlumnosModule) },
      { path: 'profesores', loadChildren: () => import('./profesores/profesores.module').then((module) => module.ProfesoresModule) },
      { path: 'cursos', loadChildren: () => import('./cursos/cursos.module').then((module) => module.CursosModule) },
      { path: 'inscripciones', loadChildren: () => import('./inscripciones/inscripciones.module').then((module) => module.InscripcionesModule) },
      // { path: '**', component: NotFoundComponent }
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

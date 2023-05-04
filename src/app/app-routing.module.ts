import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { MenuComponent } from './layout/menu/menu.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: MenuComponent,
    loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule)
  },
  // {
  //   path: '',
  //   component: MainComponent,
  //   children: [
  //     {
  //       path: 'alumnos',
  //       component: AlumnosTableComponent
  //     },
  //     {
  //       path: 'profesores',
  //       component: ProfesorTableComponent
  //     },
  //     {
  //       path: 'cursos',
  //       component: CursoTableComponent
  //     },
  //     {
  //       path: 'inscripciones',
  //       component: InscripcionTableComponent
  //     }
  //   ]
  // },
  {
    path: '**',
    component: NotFoundComponent
    // , redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

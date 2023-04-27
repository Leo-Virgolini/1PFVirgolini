import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AlumnosTableComponent } from './features/alumnos/alumno-table/alumno-table.component';
import { CursoTableComponent } from './features/cursos/curso-table/curso-table.component';
import { InscripcionTableComponent } from './features/inscripciones/inscripcion-table/inscripcion-table.component';
import { ProfesorTableComponent } from './features/profesores/profesor-table/profesor-table.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'alumnos',
        component: AlumnosTableComponent
      },
      {
        path: 'profesores',
        component: ProfesorTableComponent
      },
      {
        path: 'cursos',
        component: CursoTableComponent
      },
      {
        path: 'inscripciones',
        component: InscripcionTableComponent
      }
    ]
  },
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

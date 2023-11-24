import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginGuard } from './core/services/guards/login.guard';
import { AuthGuard } from './core/services/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    // canActivate: [LoginGuard],
    canActivate: [() => inject(LoginGuard).canActivate()],
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule)
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

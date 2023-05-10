import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginGuard } from './features/auth/guards/login.guard';
import { AuthGuard } from './features/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuard],
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

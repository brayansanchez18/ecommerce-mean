import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from './guards/admin.guard';

const appRoute: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';

const appRoute: Routes = [
  {
    path: '',
    component: InicioComponent,
  },

  /* -------------------------------------------------------------------------- */
  /*                                  USUARIOS                                  */
  /* -------------------------------------------------------------------------- */

  {
    path: 'login',
    component: LoginComponent,
  },

  /* -------------------------------- USUARIOS -------------------------------- */
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';

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
  {
    path: 'cuenta/perfil',
    component: PerfilComponent,
  },

  /* -------------------------------- USUARIOS -------------------------------- */
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);

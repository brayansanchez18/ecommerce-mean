import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { AuthGuard } from './guards/auth.guard';
import { IndexProductosComponent } from './components/productos/index-productos/index-productos.component';

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
    canActivate: [AuthGuard],
  },

  /* -------------------------------- USUARIOS -------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                  PRODUCTOS                                 */
  /* -------------------------------------------------------------------------- */

  {
    path: 'productos',
    component: IndexProductosComponent,
  },

  /* -------------------------------- PRODUCTOS ------------------------------- */
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);

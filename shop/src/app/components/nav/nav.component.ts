import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  public token: any;
  public id: any;
  public user: any;
  public user_lc: any;
  public config_global: any = {};

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this._clienteService.obtener_config_publico().subscribe((response) => {
      this.config_global = response.data;
    });

    // console.log(this.user_lc);

    if (this.token) {
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        (response) => {
          // console.log(response);
          this.user = response.data;
          // console.log(this.user);
          localStorage.setItem('user_data', JSON.stringify(this.user));

          if (localStorage.getItem('user_data')) {
            // this.user_lc = JSON.parse(localStorage.getItem('user_data')); <- esto da error 'Argument of type 'string | null''
            // se soluciona de la siguietne manera
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
            // o
            // this.user_lc = JSON.parse(localStorage.getItem('user_data') || '{}');
          } else {
            this.user_lc = undefined;
          }
        },
        (err) => {
          console.log(err);
          this.user = undefined;
        }
      );
    }
  }

  logout() {
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }
}

import { Component } from '@angular/core';
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

  constructor(private _clienteService: ClienteService) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    if (localStorage.getItem('user_data')) {
      // this.user_lc = JSON.parse(localStorage.getItem('user_data')); <- esto da error 'Argument of type 'string | null''
      // se soluciona de la siguietne manera
      this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
      // o
      // this.user_lc = JSON.parse(localStorage.getItem('user_data') || '{}');
    } else {
      this.user_lc = undefined;
    }

    console.log(this.user_lc);

    this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
      (response) => {
        // console.log(response);
        this.user = response.data;
        // console.log(this.user);
        localStorage.setItem('user_data', JSON.stringify(this.user));
      },
      (err) => {
        console.log(err);
        this.user = undefined;
      }
    );
  }
}

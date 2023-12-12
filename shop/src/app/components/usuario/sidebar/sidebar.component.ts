import { Component } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  public token: any;
  public id: any;
  public user: any;
  public user_lc: any;

  constructor(private _clienteService: ClienteService) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    // console.log(this.user_lc);

    if (this.token) {
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        (response) => {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));

          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
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
}

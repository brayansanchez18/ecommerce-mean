import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public user: any = {};
  public usuario: any = {};
  public token: any;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this._router.navigate(['/']);
    }
  }

  login(loginForm: any) {
    if (loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password,
      };

      this._clienteService.login_cliente(data).subscribe(
        (response) => {
          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: 'FF0000',
              class: 'text-danger',
              color: 'red',
              position: 'topRight',
              message: response.message,
            });
          } else {
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

            // console.log(this.usuario);

            // this._clienteService
            //   .obtener_cliente_guest(response.data._id, response.token)
            //   .subscribe(
            //     (response) => {
            //       console.log(response);
            //     },
            //     (err) => {
            //       console.log(err);
            //     }
            //   );

            this._router.navigate(['/']);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Debe ingredar correo y contraseña',
      });
    }
  }
}

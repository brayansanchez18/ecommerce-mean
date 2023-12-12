import { Component } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent {
  public cliente: any = {
    genero: '',
    pais: '',
  };
  public id: any;
  public token: any;

  constructor(private _clienteService: ClienteService) {
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if (this.id) {
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        (response) => {
          this.cliente = response.data;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      this.cliente.password = $('#input_password').val();
      this._clienteService
        .actualizar_cliente_guest(this.id, this.cliente, this.token)
        .subscribe(
          (response) => {
            console.log(response);
            iziToast.show({
              title: 'ACTUALIZADO',
              titleColor: 'FF0000',
              class: 'text-danger',
              color: 'green',
              position: 'topRight',
              message: 'El cliente se actualizo correctamente',
            });
          },
          (error) => {
            console.log(error);
          }
        );
      console.log(this.cliente);
    } else {
      iziToast.show({
        title: 'ERRROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Los datos de formulario no son validos',
      });
    }
  }
}

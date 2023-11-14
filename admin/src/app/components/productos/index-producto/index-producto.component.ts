import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css'],
})
export class IndexProductoComponent implements OnInit {
  public load_data: boolean = true;
  public filtro: string = '';
  public token: any;
  public productos: Array<any> = [];

  public arr_productos: Array<any> = [];
  public url: any;
  public page: number = 1;
  public pageSize: number = 20;
  public load_btn: boolean = false;

  constructor(private _productoService: ProductoService) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._productoService
      .listar_productos_admin(this.filtro, this.token)
      .subscribe(
        (response) => {
          // console.log(response);
          this.productos = response.data;
          this.load_data = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  filtrar() {
    if (this.filtro) {
      this._productoService
        .listar_productos_admin(this.filtro, this.token)
        .subscribe(
          (response) => {
            // console.log(response);
            this.productos = response.data;
            this.load_data = false;
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      iziToast.show({
        title: 'Error',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'ingrese la descripcion',
      });
    }
  }

  limpiar() {
    console.log('limpiar');
    this.filtro = '';
    this.init_data();
  }

  eliminar(id: any) {}
}

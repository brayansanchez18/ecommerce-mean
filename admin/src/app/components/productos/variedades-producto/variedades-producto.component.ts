import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;

@Component({
  selector: 'app-variedades-producto',
  templateUrl: './variedades-producto.component.html',
  styleUrls: ['./variedades-producto.component.css'],
})
export class VariedadesProductoComponent {
  public url: any;
  public producto: any = {};
  public nueva_variedad: string = '';
  public load_btn: boolean = false;
  public id: any;
  public token: any;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
    private _ruoute_navigate: Router
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._route.params.subscribe(
      (params) => {
        this.id = params['id'];

        this._productoService
          .obtener_producto_admin(this.id, this.token)
          .subscribe(
            (response) => {
              if (response.data == undefined) {
                this.producto = undefined;
                this._ruoute_navigate.navigate(['/panel/productos']);
              } else {
                this.producto = response.data;
              }

              // console.log(this.producto);
            },
            (err) => {
              console.log(err);
            }
          );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  agregar_variedad() {
    if (this.nueva_variedad) {
      // console.log(this.nueva_variedad);
      this.producto.variedades.push({ titulo: this.nueva_variedad });
      this.nueva_variedad = '';
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Ingrese la variedad del producto',
      });
    }
  }

  eliminar_variedad(indice: any) {
    this.producto.variedades.splice(indice, 1);
  }

  actualizar() {
    if (this.producto.titulo_variedad) {
      if (this.producto.variedades.length >= 1) {
        this.load_btn = true;
        var data: any = {
          titulo_variedad: this.producto.titulo_variedad,
          variedades: this.producto.variedades,
        };

        this._productoService
          .actualizar_producto_variedades_admin(this.id, data, this.token)
          .subscribe(
            (response) => {
              // console.log(response);

              iziToast.show({
                title: 'ACTUALIZADO',
                titleColor: 'FF0000',
                class: 'text-danger',
                color: 'green',
                position: 'topRight',
                message:
                  'Las variedades del producto se agregaron correctamente',
              });

              this.load_btn = false;
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
          message: 'Debe ingresar al menos una variedad del producto',
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Ingrese el titulo de variedad del producto',
      });
    }
  }
}

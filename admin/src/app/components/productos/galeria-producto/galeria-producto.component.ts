import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css'],
})
export class GaleriaProductoComponent {
  public producto: any = {};
  public url: any;
  public file: any;
  public token: any;
  public id: any;
  public load_btn: boolean = false;
  public load_btn_eliminar: boolean = false;

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
        this.init_data();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  init_data(): void {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
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
  }

  fileChangeEvent(event: any): void {
    var file;
    if (event.target.files && event.target.files[0]) {
      file = <any>event.target.files[0];
      //console.log(file);
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'no hay una imagen de envio',
      });
    }
    if (file.size <= 4000000) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/webp' ||
        file.type == 'image/jpg' ||
        file.type == 'image/gif' ||
        file.type == 'image/jpeg'
      ) {
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: 'FF0000',
          class: 'text-danger',
          color: 'red',
          position: 'topRight',
          message: 'el archivo debe ser una imagen',
        });

        $('#input-img').val('');
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'la imagen no debe superar 4MB',
      });

      $('#input-img').val('');
      this.file = undefined;
    }
    console.log(this.file);
  }

  subir_imagen() {
    if (this.file != undefined) {
      let data = {
        imagen: this.file,
        _id: uuidv4(),
      };

      console.log(data);

      this._productoService
        .agregar_imagen_galeria_admin(this.id, data, this.token)
        .subscribe(
          (response) => {
            // console.log(response);

            iziToast.show({
              title: 'COMPLETADO',
              titleColor: 'FF0000',
              class: 'text-danger',
              color: 'green',
              position: 'topRight',
              message: 'Imagen agregada correctamente',
            });

            this.init_data();
            $('#input-img').val('');
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
        message: 'Debe seleccinar una imagen',
      });
    }
  }

  eliminar(id: any, imagen: any) {
    this.load_btn_eliminar = true;

    this._productoService
      .eliminar_imagen_galeria_admin(
        this.id,
        { _id: id, imagen: imagen },
        this.token
      )
      .subscribe(
        (response) => {
          // console.log(response);

          iziToast.show({
            title: 'Eliminado',
            titleColor: 'FF0000',
            class: 'text-danger',
            color: 'green',
            position: 'topRight',
            message: 'La imagen se ha eliminado',
          });
          $('#delete-' + id).modal('hide');
          $('.modal-backdrop').removeClass('show');

          this.load_btn_eliminar = false;
          this.init_data();
        },

        (error) => {
          console.log(error);
        }
      );
  }
}

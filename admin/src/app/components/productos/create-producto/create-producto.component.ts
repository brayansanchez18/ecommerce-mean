import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css'],
})
export class CreateProductoComponent implements OnInit {
  public producto: any = {};
  public file: any = undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/01.png';
  public config: any = {};
  public token: any;
  public load_btn = false;
  public config_global: any = {};

  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService
  ) {
    this.config = {
      height: 500,
    };
    this.token = _adminService.getToken();
  }

  ngOnInit(): void {}

  registro(registroForm: any) {
    if (registroForm.valid) {
      if (this.file != undefined) {
        // console.log(this.producto);
        // console.log(this.file);

        this._productoService
          .registro_producto_admin(this.producto, this.file, this.token)
          .subscribe(
            (response) => {
              // console.log(response);
            },
            (error) => {
              // console.log(error);
            }
          );
      } else {
        iziToast.show({
          title: 'Error',
          titleColor: 'FF0000',
          class: 'text-danger',
          color: 'red',
          position: 'topRight',
          message: 'Debe subir una imagen',
        });
      }
    } else {
      iziToast.show({
        title: 'Error',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'los datos de formulario no son validos',
      });
    }
  }

  fileChageEvent(event: any): void {
    var filee: any;
    if (event.target.files && event.target.files[0]) {
      filee = <File>event.target.files[0];
      // console.log(filee);
    } else {
      iziToast.show({
        title: 'Error',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'no hay una imagen de envio',
      });
    }
    if (filee.size <= 4000000) {
      if (
        filee.type == 'image/png' ||
        filee.type == 'image/webp' ||
        filee.type == 'image/jpg' ||
        filee.type == 'image/gif' ||
        filee.type == 'image/jpeg'
      ) {
        const reader = new FileReader();
        reader.onload = (e) => (this.imgSelect = reader.result);
        // console.log(this.imgSelect);
        reader.readAsDataURL(filee);

        $('#input-portada').text(filee.name);

        this.file = filee;
      } else {
        iziToast.show({
          title: 'Error',
          titleColor: 'FF0000',
          class: 'text-danger',
          color: 'red',
          position: 'topRight',
          message: 'el archivo debe ser una imagen',
        });
        $('#input-portada').text('Selecionar imagen');
        this.imgSelect = 'assets/img/01.png';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'Error',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'la imagen no debe superar 4MB',
      });
      $('#input-portada').text('Selecionar imagen');
      this.imgSelect = 'assets/img/01.png';
      this.file = undefined;
    }
    // console.log(this.file);
  }
}

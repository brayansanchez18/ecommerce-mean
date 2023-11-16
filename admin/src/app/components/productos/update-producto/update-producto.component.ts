import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css'],
})
export class UpdateProductoComponent implements OnInit {
  public producto: any = {};
  public config: any = {};
  public imgSelect: any | ArrayBuffer = 'assets/img/01.png';
  public load_btn: boolean = false;
  public id: any;
  public token: any;
  public url: any;
  public file: any;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
    private _router: Router,
    private _adminService: AdminService
  ) {
    this.config = {
      height: 500,
    };
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);
      this._productoService
        .obtener_producto_admin(this.id, this.token)
        .subscribe(
          (response) => {
            // console.log(response);
            if (response.data == undefined) {
              this.producto = undefined;
            } else {
              this.producto = response.data;
              this.imgSelect = this.producto.portada;
              this.imgSelect = `${this.url}obtener_portada/${this.producto.portada}`;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  actuailzar(actuailzarForm: any) {
    if (actuailzarForm.valid) {
      // console.log(this.producto);
      // console.log(this.file);

      var data: any = {};

      if (this.file != undefined) {
        data.portada = this.file;
      }

      data.titulo = this.producto.titulo;
      data.stock = this.producto.stock;
      data.precio = this.producto.precio;
      data.categoria = this.producto.categoria;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido;

      this.load_btn = true;

      this._productoService
        .actualizar_prodcuto_admin(data, this.id, this.token)
        .subscribe(
          (response) => {
            // console.log(response);

            iziToast.show({
              title: 'ACTUALIZADO',
              titleColor: 'FF0000',
              class: 'text-danger',
              color: 'green',
              position: 'topRight',
              message: 'El producto se actualizo correctamente',
            });

            this.load_btn = false;
            this._router.navigate(['/panel/productos']);
          },
          (err) => {
            console.log(err);
            this.load_btn = false;
          }
        );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'los datos del formulario no son validos',
      });
      this.load_btn = false;
    }
  }

  fileChageEvent(event: any): void {
    var file;
    if (event.target.files && event.target.files[0]) {
      file = <any>event.target.files[0];
      //console.log(file);
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay una imagen de envio',
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
        const reader = new FileReader();
        reader.onload = (e) => (this.imgSelect = reader.result);
        // console.log(this.imgSelect);
        reader.readAsDataURL(file);
        $('#input-portada').text(file.name);
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen',
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'la imagen no puede superar los 4mb',
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
    // console.log(this.file);
  }
}

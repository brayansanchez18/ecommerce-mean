import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit {
  public config: any = [];
  public titulo_cat: string = '';
  public icono_cat: string = '';
  public imgSelect: any | ArrayBuffer;
  public token: any;
  public url: any;
  public file: any;

  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_admin(this.token).subscribe(
      (response) => {
        // console.log(response);
        this.config = response.data;
        // console.log(this.config);
        this.imgSelect = this.url + 'obtener_logo/' + this.config.logo;
      },

      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {}

  agregar_cat() {
    if (this.titulo_cat && this.icono_cat) {
      // console.log(uuidv4());

      this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id: uuidv4(),
      });

      this.titulo_cat = '';
      this.icono_cat = '';
    } else {
      iziToast.show({
        title: 'ERRROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Debe ingresar un titulo e icono para la categoria',
      });
    }
  }

  actualizar(confForm: any) {
    if (confForm.valid) {
      let data = {
        titulo: confForm.value.titulo,
        serie: confForm.value.serie,
        correlativo: confForm.value.correlativo,
        categorias: this.config.categorias,
        logo: this.file,
      };

      // console.log(data);

      this._adminService
        .actualizar_config_admin('6556db676b2fe97a71977298', data, this.token)
        .subscribe(
          (response) => {
            // console.log(response);

            this._adminService.obtener_config_admin(this.token).subscribe(
              (response) => {
                // console.log(response);
                this.config = response.data;
              },

              (err) => {
                console.log(err);
              }
            );

            iziToast.show({
              title: 'ACUTALIZADO',
              titleColor: 'FF0000',
              class: 'text-success',
              color: 'green',
              position: 'topRight',
              message: 'se actualizo correctamente la configuracion',
            });
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      iziToast.show({
        title: 'ERRROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Complete correctamente el formulario',
      });
    }
  }

  eliminar_categoria(indice: any) {
    this.config.categorias.splice(indice, 1);
  }

  fileChangeEvent(event: any) {
    var file;
    if (event.target.files && event.target.files[0]) {
      file = <any>event.target.files[0];
      //console.log(file);
    } else {
      iziToast.show({
        title: 'ERRROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
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
        $('.cs-file-drop-icon').addClass(
          'cs-file-drop-preview img-thumbnail rounded'
        );
        $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');
        reader.readAsDataURL(file);
        $('#input-portada').text(file.name);
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERRROR',
          titleColor: 'FF0000',
          class: 'text-danger',
          color: 'red',
          position: 'topRight',
          message: 'El archivo debe ser una imagen',
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERRROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'la imagen no puede superar los 4MB',
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
    // console.log(this.file);
  }

  ngDoCheck(): void {
    $('.cs-file-drop-preview').html('<img src=' + this.imgSelect + '>');
  }
}

import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}

  registro(registroForm: any) {
    if (registroForm.valid) {
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

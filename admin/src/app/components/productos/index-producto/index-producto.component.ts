import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

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

          this.productos.forEach((element) => {
            this.arr_productos.push({
              titulo: element.titulo,
              stock: element.stock,
              precio: element.precio,
              categoria: element.categoria,
              nventas: element.nventas,
            });
          });
          // console.log(this.arr_productos);

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
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'ingrese la descripcion',
      });
    }
  }

  limpiar() {
    // console.log('limpiar');
    this.filtro = '';
    this.init_data();
  }

  eliminar(id: any) {
    // TODO: al emiminar un producto eliminar la galeria de imagenes
    // TODO: cuando se elimine categoria, colocar una alerta en la tabla proeductos
    this.load_btn = true;
    this._productoService.eliminar_prodcuto_admin(id, this.token).subscribe(
      (response) => {
        console.log(response.data);

        iziToast.show({
          title: 'Eliminado',
          titleColor: 'FF0000',
          class: 'text-danger',
          color: 'green',
          position: 'topRight',
          message: 'El producto fue eliminado',
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      },

      (error) => {
        console.log(error);
      }
    );
  }

  download_excel() {
    // TODO: mojorar el diseño de la hoja de excel
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte de productos');

    worksheet.addRow(undefined);
    for (let x1 of this.arr_productos) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      { header: 'Producto', key: 'col1', width: 30 },
      { header: 'Stock', key: 'col2', width: 15 },
      { header: 'Precio $MXN', key: 'col3', width: 15 },
      { header: 'Categoria', key: 'col4', width: 25 },
      { header: 'N° ventas', key: 'col5', width: 15 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}

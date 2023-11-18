import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css'],
})
export class InventarioProductoComponent implements OnInit {
  public id: any;
  public token: any;
  public _idUser: any;
  public producto: any = {};
  public inventarios: Array<any> = [];
  public load_btn: boolean = false;
  public inventario: any = {};
  public arr_inventario: Array<any> = [];

  public page: number = 1;
  public pageSize: number = 20;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this._idUser = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);
      this._productoService
        .obtener_producto_admin(this.id, this.token)
        .subscribe(
          (response) => {
            if (response.data == undefined) {
              this.producto = undefined;
            } else {
              this.producto = response.data;
              this._productoService
                .listar_inventario_producto_admin(this.producto._id, this.token)
                .subscribe(
                  (response) => {
                    this.inventarios = response.data;

                    // console.log(response);

                    this.inventarios.forEach((element) => {
                      this.arr_inventario.push({
                        admin:
                          element.admin.nombres + ' ' + element.admin.apellidos,
                        correo_admin: element.admin.email,
                        cantidad: element.cantidad,
                        proveedor: element.proveedor,
                      });
                    });
                    console.log(this.inventarios);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._productoService
      .eliminar_inventario_producto_admin(id, this.token)
      .subscribe(
        (response) => {
          iziToast.show({
            title: 'ELIMINADO',
            titleColor: 'FF0000',
            class: 'text-danger',
            color: 'green',
            position: 'topRight',
            message: 'El registro fue eliminado',
          });
          $('#delete-' + id).modal('hide');
          $('.modal-backdrop').removeClass('show');

          this.load_btn = false;

          this._productoService
            .listar_inventario_producto_admin(this.producto._id, this.token)
            .subscribe(
              (response) => {
                // console.log(response);
                this.inventarios = response.data;
              },
              (err) => {
                console.log(err);
              }
            );
        },

        (error) => {
          console.log(error);
        }
      );
  }

  registro_inventario(inventarioForm: any) {
    if (inventarioForm.valid) {
      // console.log(this.inventario);

      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this._idUser,
        proveedor: inventarioForm.value.proveedor,
      };

      // console.log(data);

      this._productoService
        .registro_inventario_producto_admin(data, this.token)
        .subscribe(
          (response) => {
            // console.log(response);
            iziToast.show({
              title: 'COMPLETADO',
              titleColor: 'FF0000',
              class: 'text-danger',
              color: 'green',
              position: 'topRight',
              message: 'El registro de inventario se registro correctamente',
            });

            this.inventario.cantidad = '';
            this.inventario.proveedor = '';

            this._productoService
              .listar_inventario_producto_admin(this.producto._id, this.token)
              .subscribe(
                (response) => {
                  // console.log(response);
                  this.inventarios = response.data;
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
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Ingrese Cantidad y Proovedor',
      });
    }
  }

  download_excel() {
    // TODO: mejorar el diseno de la hoja de excel
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte de productos');

    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      { header: 'Trabajador', key: 'col1', width: 30 },
      { header: 'Correo Trabajador', key: 'col2', width: 30 },
      { header: 'Cantidad', key: 'col3', width: 15 },
      { header: 'Proveedor', key: 'col4', width: 25 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}

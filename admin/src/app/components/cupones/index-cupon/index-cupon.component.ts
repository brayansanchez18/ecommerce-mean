import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css'],
})
export class IndexCuponComponent implements OnInit {
  public filtro: string = '';
  public load_data: boolean = true;
  public cupones: Array<any> = [];
  public page = 1;
  public pageSize = 20;
  public token: any;

  constructor(
    private _cuponService: CuponService,
    private _adminService: AdminService
  ) {
    this.token = _adminService.getToken();
  }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      (response) => {
        // console.log(response);
        this.cupones = response.data;
        this.load_data = false;
      },
      (err) => {
        console.log(err);
        this.load_data = false;
      }
    );
  }

  filtrar() {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      (response) => {
        this.cupones = response.data;
        this.load_data = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  limpiar() {
    this.filtro = '';
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      (response) => {
        // console.log(response);
        this.cupones = response.data;
        this.load_data = false;
      },
      (err) => {
        console.log(err);
        this.load_data = false;
      }
    );
  }

  eliminar(id: any) {}
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css'],
})
export class UpdateCuponComponent implements OnInit {
  public cupon: any = {
    tipo: '',
  };
  public load_btn: boolean = false;
  public token: any;
  public id: any;
  public load_data: boolean = true;

  constructor(
    private _cuponService: CuponService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);

      this._cuponService.obtener_cupon_admin(this.id, this.token).subscribe(
        (response) => {
          if (response.data == undefined) {
            this.cupon = undefined;
            this.load_data = false;
          } else {
            this.cupon = response.data;
            this.load_data = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      // console.log(this.cupon);
      this.load_btn = true;

      this._cuponService
        .actualizar_cupon_admin(this.id, this.cupon, this.token)
        .subscribe((response) => {
          // console.log(response);
          iziToast.show({
            title: 'ACUTLIZADO',
            titleColor: 'FF0000',
            class: 'text-danger',
            color: 'green',
            position: 'topRight',
            message: 'El cupon se actualizo correctamente',
          });

          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
        });
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: 'FF0000',
        class: 'text-danger',
        color: 'red',
        position: 'topRight',
        message: 'Los datos de formulario no son validos',
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css'],
})
export class CreateCuponComponent implements OnInit {
  public cupon: any = {
    tipo: '',
  };
  public token: any;
  public load_btn: boolean = false;

  constructor(private _cuponService: CuponService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {}

  registro(registroForm: any) {
    if (registroForm.valid) {
      // console.log(this.cupon);

      this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
        (response) => {
          console.log(response);
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
        message: 'los datos de formulario no son validos',
      });
    }
  }
}

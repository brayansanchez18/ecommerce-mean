import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private _cuponService: CuponService, private _router: Router) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {}

  registro(registroForm: any) {
    if (registroForm.valid) {
      this.load_btn = true;
      // console.log(this.cupon);

      this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
        (response) => {
          // console.log(response);
          iziToast.show({
            title: 'REGISTRADO',
            titleColor: 'FF0000',
            class: 'text-danger',
            color: 'green',
            position: 'topRight',
            message: 'El cupon se registro correctamente',
          });

          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
        },
        (err) => {
          console.log(err);
          this.load_btn = false;
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

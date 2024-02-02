import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';

declare var noUiSlider: any;
declare var $: any;

@Component({
  selector: 'app-index-productos',
  templateUrl: './index-productos.component.html',
  styleUrls: ['./index-productos.component.css'],
})
export class IndexProductosComponent implements OnInit {
  public config_global: any = {};
  public filter_categoria: any;
  public productos: Array<any> = [];
  public filter_productos: any;

  public url: any;
  public load_data = true;

  constructor(private _clienteService: ClienteService) {
    this.url = GLOBAL.url;
    this._clienteService.obtener_config_publico().subscribe(
      (response) => {
        this.config_global = response.data;
      },
      (err) => {
        console.log(err);
      }
    );

    this._clienteService.listar_productos_publico('').subscribe((response) => {
      this.productos = response.data;
      this.load_data = false;
    });
  }

  ngOnInit(): void {
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 1000],
      connect: true,
      decimals: false,
      range: {
        min: 0,
        max: 1000,
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,
      },
    });

    slider.noUiSlider.on('update', function (values: any) {
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');
  }

  buscar_categorias() {
    if (this.filter_categoria) {
      var search = new RegExp(this.filter_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter(
        (item: any) => search.test(item.titulo)
      );
    } else {
      this._clienteService.obtener_config_publico().subscribe((response) => {
        this.config_global = response.data;
      });
    }
  }

  buscar_producto() {
    this._clienteService
      .listar_productos_publico(this.filter_productos)
      .subscribe((response) => {
        this.productos = response.data;
        this.load_data = false;
      });
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  url: string;
  headers: Headers;
  trabajadores: any[];

  constructor(
    public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http
    , public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.headers = new Headers();
    this.headers.append('X-Parse-REST-API-Key', 'restAPIKey');
    this.headers.append('X-Parse-Master-Key', 'masterKey');
    this.headers.append('X-Parse-Application-id', 'Lista1');
    this.getTrabajadores();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }


  dialogoAdd() {
    this.alertCtrl.create({
      title: 'Añadir trabajador',
      message: 'Ingresa los datos del nuevo usuario',
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Nombre',
        },
        {
          name: 'email',
          placeholder: 'Email'
        },
        {
          name: 'telefono',
          placeholder: 'Teléfono'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            let loading = this.loadingCtrl.create({
              content: 'Cargando'
            });
            loading.present();

            this.url = "http://localhost:8080/lista/classes/listaTrabajadores";
            this.http.post(this.url, {
              nombre: data.nombre, email: data.email, telefono: data.telefono
              , imagen: 'http://lorempixel.com/34/34/'
            }, { headers: this.headers }).pipe(map(res => res.json())).subscribe(
              response => {
                loading.dismiss();
                this.toastCtrl.create({
                  message: 'El trabajador se ha creado exitasamente',
                  duration: 4000,
                  position: 'middle'
                }).present();
                // this.alertCtrl.create({
                //   title: "Exito",
                //   message: 'El trabajador se registro correctamente',
                //   buttons: [{ text: 'Aceptar' }]
                // }).present();
              },
              error => {
                loading.dismiss();
                this.toastCtrl.create({
                  message: 'Ha ocurrido un error intentelo de nuevo',
                  duration: 4000,
                  position: 'middle'
                }).present();
                // this.alertCtrl.create({
                //   title: 'Error',
                //   message: 'Ha ocurrido un error al crear el trabajdor',
                //   buttons: ['Aceptar']
                // }).present();

              }
            )
          }
        }
      ]
    }).present();
  }

  getTrabajadores() {
    this.url = 'http://localhost:8080/lista/classes/listaTrabajadores';
    this.http.get(this.url, { headers: this.headers })
      .pipe(map(res => res.json()))
      .subscribe(
        response => {
          this.trabajadores = response.results;
        },
        error => {
          this.alertCtrl.create({
            title: 'Error',
            message: 'Ha ocurrido un error al crear el trabajdor',
            buttons: ['Aceptar']
          }).present();
        }
      )

  }

}

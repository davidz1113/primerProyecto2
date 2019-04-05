import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

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
  idUsuario: string;
  constructor(
    public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http
    , public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public localStorage: Storage
  ) {
    this.headers = new Headers();
    this.headers.append('X-Parse-REST-API-Key', 'restAPIKey');
    this.headers.append('X-Parse-Master-Key', 'masterKey');
    this.headers.append('X-Parse-Application-id', 'Lista1');
    this.localStorage = new Storage(null);

    this.localStorage.get('idUsuario')
      .then((valor) => {
        this.idUsuario = valor;
        this.getTrabajadores();
      })

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
              , imagen: 'http://lorempixel.com/34/34/', propietario: this.idUsuario
            }, { headers: this.headers }).pipe(map(res => res.json())).subscribe(
              response => {
                this.getTrabajadores();
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

  getTrabajadores(refresher?) {
    this.url = 'http://localhost:8080/lista/classes/listaTrabajadores?where={"propietario":"' + this.idUsuario + '"}';
    this.http.get(this.url, { headers: this.headers })
      .pipe(map(res => res.json()))
      .subscribe(
        response => {
          this.trabajadores = response.results;
          if (refresher) {
            refresher.complete();
          }
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

  /**
   * 
   * @param trabajador 
   */
  editarTrabajador(trabajador) {
    this.alertCtrl.create({
      title: "Editar Trabajador",
      message: "Modifica la información del trabajador aquí",
      inputs: [
        {
          name: "nombre",
          placeholder: "Nombre",
          value: trabajador.nombre
        },
        {
          name: "email",
          placeholder: "Email",
          value: trabajador.email
        },
        {
          name: "telefono",
          placeholder: "Teléfono",
          value: trabajador.telefono
        }
      ],
      buttons: [
        {
          text: "Cancelar"
        },
        {
          text: "Guardar",
          handler: data => {
            //editar en el servidor
            const { nombre, email, telefono } = data;
            this.url = 'http://localhost:8080/lista/classes/listaTrabajadores/' + trabajador.objectId;
            this.http.put(this.url, { nombre, email, telefono }, { headers: this.headers }).pipe(map(res => res.json()))
              .subscribe(
                response => {
                  this.toastCtrl.create({
                    message: 'Los datos se han modificado satisfactoriamente',
                    duration: 3000,
                    position: 'middle'
                  }).present();
                  this.getTrabajadores();
                },
                error => {
                  this.toastCtrl.create({
                    message: 'Ha ocurrido un error intentelo de nuevo',
                    duration: 3000,
                    position: 'middle'
                  }).present();
                }
              )
          }
        }
      ]
    }).present();
  }

  deleteTrabajador(trabajador) {
    this.alertCtrl.create({
      title: 'Eliminar registro',
      message: '¿Esta seguro de eliminar este registro?',
      buttons: [
        { text: 'No' },
        {
          text: 'Si',
          handler: () => {
            this.url = 'http://localhost:8080/lista/classes/listaTrabajadores/' + trabajador.objectId;
            this.http.delete(this.url, { headers: this.headers }).pipe(map(res => res.json())
            ).subscribe(
              response => {
                this.toastCtrl.create({
                  message: 'El trabajador se han ELIMINADO satisfactoriamente',
                  duration: 3000,
                  position: 'middle'
                }).present();
                this.getTrabajadores();
              },
              error => {
                this.toastCtrl.create({
                  message: 'Ha ocurrido un error intentelo de nuevo',
                  duration: 3000,
                  position: 'middle'
                }).present();
              }

            );
          }

        }
      ]
    }).present();
  }
}

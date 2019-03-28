import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  usuarioARegistrar: User = {
    username: "",
    password: "",
    name: "",
    email: ""
  }
  confirmarContrasenia: string;
  url: string;
  headers: Headers;


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertContrl: AlertController, public http: Http) {
    this.headers = new Headers();
    this.headers.append('X-Parse-REST-API-Key', 'restAPIKey');
    this.headers.append('X-Parse-Master-Key', 'masterKey');
    this.headers.append('X-Parse-Application-id', 'Lista1');
  }

  irALogin() {
    this.navCtrl.pop();
  }


  registrar() {
    if (this.usuarioARegistrar.password != this.confirmarContrasenia) {
      this.alertContrl.create({
        title: 'Error',
        message: 'Las contraseñas no coinciden',
        buttons: ['Aceptar']
      }).present();
      return;
    }

    this.url = 'http://localhost:8080/lista/users';
    this.http.post(this.url, this.usuarioARegistrar, { headers: this.headers }).pipe
      (map(res => res.json()))
      .subscribe(
        response => {
          this.alertContrl.create({
            title: 'Usuario registrado',
            message: 'El usuario se ha registrado exitosamente en la aplicacion.' +
              'Regresa a la pagina de inicio de sesion para ingresar al Sistema',
            buttons: [{
              text: 'Inicia sesión',
              handler: () => {
                this.navCtrl.pop();
              }
            }]
          }).present();
        },
        error => {
          this.alertContrl.create({
            title: 'Error',
            message: error.text(),
            buttons: ['Aceptar']
          }).present();

        }
      );
  }


}

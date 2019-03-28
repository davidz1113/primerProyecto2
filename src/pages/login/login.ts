import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { User } from '../../user-model';
import { Headers, Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  usuarioALoguear: User = {
    username: '',
    password: ''
  }

  url: string;
  headers: Headers;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: Http) {
    this.headers = new Headers();
    this.headers.append('X-Parse-REST-API-Key', 'restAPIKey');
    this.headers.append('X-Parse-Master-Key', 'masterKey');
    this.headers.append('X-Parse-Application-id', 'Lista1');

  }


  irARegistro() {
    this.navCtrl.push(RegistroPage);
  }

  login() {
    if ((this.usuarioALoguear.username != "" && this.usuarioALoguear.password != "")) {
      this.url = 'http://localhost:8080/lista/login?username=' + this.usuarioALoguear.username + '&password=' + this.usuarioALoguear.password;
      this.http.get(this.url, { headers: this.headers }).pipe(map(res => res.json()))
        .subscribe(
          response => {
            this.navCtrl.setRoot(HomePage);
          },
          err => {
            this.alertCtrl.create({ title: "Error", message: "El usuario es incorrecto", buttons: [{ text: "Aceptar" }] })
              .present()
          }
        )

    } else {
      this.alertCtrl.create({ title: "Error", message: "Ningún campo puede ser vacío", buttons: [{ text: "Aceptar" }] })
        .present()
    }


  }

}

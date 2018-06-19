import { Component } from '@angular/core';
import { NavController, Events, AlertController, Alert } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private alertCtrl: AlertController) {

  }

  onLogout() {
    const alert: Alert = this.alertCtrl.create({
      title: 'Are you sure you want to logout ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => { this.events.publish('user:logout'); }
      }]
    });

    alert.present();
  }

}

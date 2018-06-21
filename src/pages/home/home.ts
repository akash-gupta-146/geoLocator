import { Component } from '@angular/core';
import { NavController, Events, AlertController, Alert, Platform, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CustomService } from '../../providers/custom.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  res: any;

  // HomePage is opened in two cases:
  // 1: after login
  // 2: after granting both permissions, in this case no need to perform those checks again
  allChecked;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private alertCtrl: AlertController,
    private customService: CustomService,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {
    this.allChecked = this.navParams.get('allChecked') || false;
  }

  ionViewDidLoad() {

    if (!this.allChecked) {
      this.checkLocationPermission();
    }

  }

  checkLocationPermission() {

    this.diagnostic.getLocationAuthorizationStatus()
      .then((status) => {

        this.debugAlert(JSON.stringify(status));
        switch (status) {

          case this.diagnostic.permissionStatus.GRANTED:
            // make GPS enable request
            this.check_GPS_Status();
            break;

          // ios only
          case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            // make locaiton enable request
            break;

          case this.diagnostic.permissionStatus.NOT_REQUESTED:
            // grant permission
            this.openLocationAccessOffPage(status);
            break;

          case this.diagnostic.permissionStatus.DENIED:
            // grant permission
            this.openLocationAccessOffPage(status);
            break;

          case this.diagnostic.permissionStatus.DENIED_ALWAYS:
            // grant permission
            this.openLocationAccessOffPage(status);
            break;
        }
      })
      .catch(err => {

        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Error in checking location access',
          message: JSON.stringify(err)
        });
        alert.present();
      });
  }


  openLocationAccessOffPage(status: string) {

    this.navCtrl.setRoot('LocationAccessOffPage', { 'status': status }, { animate: true, direction: 'forward' });

  }

  check_GPS_Status() {

    this.locationAccuracy.canRequest()
      .then((canRequest: boolean) => {

        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then((res) => {
              this.debugAlert('Request successful' + JSON.stringify(res));
              // this.onClockIn();
            }, (error) => {
              this.debugAlert(JSON.stringify(error));

              if (error.code == this.locationAccuracy.ERROR_USER_DISAGREED) {
                this.navCtrl.setRoot('GpsOffPage', { animate: true, direction: 'forward' });
              } else {

                const alert1 = this.alertCtrl.create({
                  title: 'Error occured',
                  subTitle: "Couldn't enable the location service. Please go to settings and enable it manually ",
                  message: JSON.stringify(error.message)
                });
                alert1.present();
              }
            });
        } else {
          this.debugAlert('Can request : FALSE');
        }

      });
  }

  onClockIn() {
    this.customService.showLoader('Getting Location...');
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 90000, maximumAge: 0 }).then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.customService.hideLoader();
      this.res = resp.coords.latitude + ' ' + resp.coords.longitude;
      this.debugAlert(resp.coords.latitude + ' ' + resp.coords.longitude);
    }).catch((error) => {
      this.customService.hideLoader();
      this.debugAlert(JSON.stringify(error));
      this.res = error.message;

    });
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

  debugAlert(msg: string) {
    const alert = this.alertCtrl.create({
      message: JSON.stringify(msg)
    });
    alert.present();
  }

}

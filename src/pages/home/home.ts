import { Component } from '@angular/core';
import { NavController, Events, AlertController, Alert, Platform, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CustomService } from '../../providers/custom.service';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // HomePage is opened in two cases:
  // 1: after login
  // 2: after granting both permissions, in this case no need to perform those checks again
  allChecked;
  clockedIn: boolean; // wheather person is clockedIn or not

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private alertCtrl: AlertController,
    private customService: CustomService,
    private authService: AuthService,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {
    this.allChecked = this.navParams.get('allChecked') || false;
    this.clockedIn = this.authService.isClockedIn();
  }

  ionViewDidLoad() {

    if (!this.allChecked) {
      if (this.platform.is('android')) {

        this.checkLocationPermission();
      } else {
        // for ios, check if locations services/GPS is on or off
        // delay is given in IOS because sometimes plugins take time to load and hence throw error
        this.customService.showLoader();
        setTimeout(() => {

          this.diagnostic.isLocationEnabled()
            .then((enabled) => {
              this.customService.hideLoader();
              if (enabled) {
                this.checkLocationPermission();
              } else {
                // open gps off page
                this.navCtrl.setRoot("GpsOffPage", {}, { animate: true, direction: 'forward' });
              }
            })
            .catch(err => {
              this.customService.hideLoader();
              const alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Error in checking location status. Please restart the application',
                message: JSON.stringify(err)
              });
              alert.present();
            });
        }, 1000);

      }
    }

  }

  checkLocationPermission() {


    this.diagnostic.getLocationAuthorizationStatus()
      .then((status) => {

        // this.debugAlert(JSON.stringify(status));
        switch (status) {

          case this.diagnostic.permissionStatus.GRANTED:
            if (this.platform.is('android')) {
              // make GPS enable request
              this.check_GPS_Status();
            } else {
              // for ios, do nothing, clock in allowed
            }
            break;


          case this.diagnostic.permissionStatus.NOT_REQUESTED:
            // grant permission
            this.openLocationAccessOffPage(status); // for ios: call this only for not_requested case, for others no effect 
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

    // this.debugAlert('check gps called');

    this.locationAccuracy.canRequest()
      .then((canRequest: boolean) => {

        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then((res) => { },
              (error) => {

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
    this.obtainAndUploadPosition(true);
  }

  onClockOut() {
    this.obtainAndUploadPosition(false);
  }

  obtainAndUploadPosition(forClockIn: boolean) {

    const msg = `Clocked ${forClockIn ? 'In' : 'Out'} Successfully`;

    this.obtainCurrentPosition()
      .then(location => this.upLoadCurrentPosition(location))
      .then(response => {
        this.clockedIn = !forClockIn;
        this.customService.showToast(msg);
      })
      .catch(error => {
        this.customService.hideLoader();
        this.debugAlert(JSON.stringify(error));
      });
  }

  obtainCurrentPosition(): Promise<any> {
    return new Promise((res, rej) => {

      this.customService.showLoader('Getting Location...');
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 90000, maximumAge: 0 })
        .then((response) => {
          // resp.coords.latitude
          // resp.coords.longitude
          this.customService.hideLoader();
          // this.debugAlert(resp.coords.latitude + ' ' + resp.coords.longitude);
          res(response);
        });
    });
  }

  upLoadCurrentPosition(location: any) {
    return new Promise((res, rej) => {

      this.customService.showLoader('Uploading Location...');
      // this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 90000, maximumAge: 0 })
      //   .then((resp) => {
      //     // resp.coords.latitude
      //     // resp.coords.longitude
      //     this.customService.hideLoader();
      //     // this.debugAlert(resp.coords.latitude + ' ' + resp.coords.longitude);
      //     res(resp);
      //   });
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

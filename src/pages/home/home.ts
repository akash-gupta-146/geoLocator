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
  location: { lat: string, long: string };
  clockedInTime: string;
  clockedOutTime: string;

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
    this.showLocationAndTime();
  }

  showLocationAndTime() {

    this.location = JSON.parse(localStorage.getItem('lastLocation'));
    this.clockedInTime = localStorage.getItem('clockedInTime');
    this.clockedOutTime = localStorage.getItem('clockedOutTime');
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
    this.askForConfirmation('In')
      .then(() => {
        // do further action on confirm btn
        this.obtainAndUploadPosition(true);
      }, () => {
        // do nothing on cancel btn
      });
  }

  onClockOut() {
    this.askForConfirmation('Out')
      .then(() => {
        // do further action on confirm btn
        this.obtainAndUploadPosition(false);
      }, () => {
        // do nothing on cancel btn
      });
  }

  askForConfirmation(msg: string) {
    return new Promise((res, rej) => {
      const alert: Alert = this.alertCtrl.create({
        title: 'Confirmation',
        message: `Please confirm to Clock ${msg}`,
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => rej()
        }, {
          text: 'Confirm',
          handler: () => {
            alert.dismiss().then(() => res());
            return false;
          }
        }]
      });

      alert.present();
    });
  }

  obtainAndUploadPosition(forClockIn: boolean) {

    const msg = `Clocked ${forClockIn ? 'In' : 'Out'} Successfully`;

    this.obtainCurrentPosition()
      .then(location => this.upLoadCurrentPosition(location, forClockIn))
      .then(response => {
        this.clockedIn = forClockIn;
        // alert(JSON.stringify(response));
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

  upLoadCurrentPosition(location: any, forClockIn: boolean) {
    return new Promise((res, rej) => {

      const payLoad: any = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      forClockIn ? payLoad['clockIn'] = true : payLoad['clockOut'] = true;

      this.customService.showLoader('Uploading Location...');

      this.authService.uploadClockInLocation(payLoad)
        .subscribe((resp: any) => {
          this.customService.hideLoader();

          

          // save and show location and time 
          const loc: any = { lat: location.coords.latitude, long: location.coords.longitude };
          const inTime: string = forClockIn ? new Date().toISOString() : localStorage.getItem('clockedInTime');
          const outTime: string = forClockIn ? null : new Date().toISOString();
          this.authService.saveTimeAndLocation(forClockIn, inTime, outTime, loc);
          this.showLocationAndTime();

          // resolve the promise
          res(resp);
        }, (err: any) => {
          // alert(JSON.stringify(err));
          this.customService.hideLoader();
          rej(err.msg);
        });

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
        handler: () => { this.sendLogoutRequest(); }
      }]
    });

    alert.present();
  }

  sendLogoutRequest() {
    this.customService.showLoader('Logging out...');
    this.authService.logout()
      .subscribe((resp: any) => {
      //  alert( JSON.stringify(resp));
        this.customService.hideLoader();
        this.events.publish('user:logout');

      }, (err: any) => {
        // alert( JSON.stringify(err));
        this.customService.hideLoader();
        this.customService.showToast(err.msg);
      });
  }


  debugAlert(msg: string) {
    const alert = this.alertCtrl.create({
      message: JSON.stringify(msg)
    });
    alert.present();
  }


}

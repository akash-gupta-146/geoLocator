import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HomePage } from '../home/home';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Subscription } from 'rxjs/Subscription';



@IonicPage()
@Component({
  selector: 'page-location-access-off',
  templateUrl: 'location-access-off.html',
})
export class LocationAccessOffPage {

  denied_always = false; // used only in case of android
  deniedForIos = false; // used only in case of ios
  resumeSubscription: Subscription;
  resuming: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private openNativeSettings: OpenNativeSettings
  ) {
    if (this.platform.is('android')) {
      this.denied_always = this.navParams.get('status') == this.diagnostic.permissionStatus.DENIED_ALWAYS;
    } else {
      this.deniedForIos = this.navParams.get('status') == this.diagnostic.permissionStatus.DENIED;
    }
  }

  ionViewDidEnter() {
    if (this.platform.is('android')) {
      this.subscribeToResumeEvent();
    }
  }

  subscribeToResumeEvent() {
    // listen to resume event for recheckingn the 
    this.resumeSubscription = this.platform.resume
      .subscribe((res) => {
        // this.debugAlert('RESUME SUCCESSFULL');
        this.resuming && this.requestLocationPermission();
      }, (err) => {
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Error in checking status of location access',
          message: 'Please restart the app'
        });
        alert.present();
      });
  }

  ionViewWillLeave() {
    this.platform.is('android') && this.resumeSubscription.unsubscribe();
  }

  onAllowBtn() {

    if (this.platform.is('android')) {


      if (this.denied_always) {
        // open settings
        // this.diagnostic.switchToLocationSettings();
        this.resuming = true;
        this.openNativeSettings.open('application_details')
          .then(() => { })
          .catch(() => {
            const alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Error in opening settings',
              message: 'Please open the device settings manually'
            });
            alert.present();
          });
      } else {
        this.requestLocationPermission();
      }
    } else {
      // for ios
      if (!this.deniedForIos) {
        // native dialog box is shown only
        // if requesting location first time after installation of app
        // in that case permission status is NOT_REQUESTED
        // in case of permission status  DENIED calling below method will have no efect, hence call in case of NOT_REQUESTED only
        this.requestLocationPermissionForIos();
      } else {
        // do nothing , just show the steps to be followed through settings app on screen to give the app location access
      }


    }
  }

  requestLocationPermissionForIos() {

    // this.debugAlert('request location for ios permission called');

    this.diagnostic.requestLocationAuthorization()
      .then((status) => {
        // this.debugAlert(JSON.stringify(status));
        switch (status) {
          case this.diagnostic.permissionStatus.GRANTED:
          case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            // allow clock in , go to home page
            this.navCtrl.setRoot(HomePage, { 'allChecked': true }, { animate: true, direction: 'forward' });
            break;

          case this.diagnostic.permissionStatus.DENIED:
            //  hide allow btn
            this.deniedForIos = true;
            break;

          case this.diagnostic.permissionStatus.NOT_REQUESTED:
            // this.debugAlert('Not requested');
            break;
        }
      })
      .catch(err => {
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Error in requesting location access',
          message: JSON.stringify(err)
        });
        alert.present();
      });
  }

  requestLocationPermission() {

    // this.debugAlert('request location permission called');

    this.diagnostic.requestLocationAuthorization()
      .then((status) => {
        // this.debugAlert(JSON.stringify(status));
        this.resuming = false;
        switch (status) {
          case this.diagnostic.permissionStatus.GRANTED:
            this.checkLocationEnabledOrNot();
            break;



          case this.diagnostic.permissionStatus.DENIED:

            break;

          // android only
          case this.diagnostic.permissionStatus.DENIED_ALWAYS:
            this.denied_always = true;
            break;

          case this.diagnostic.permissionStatus.NOT_REQUESTED:
            // this.debugAlert('Not requested');
            break;
        }
      })
      .catch(err => {
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Error in requesting location access',
          message: JSON.stringify(err)
        });
        alert.present();
      });
  }

  checkLocationEnabledOrNot() {
    // this.debugAlert('checkLocationEnabledOrNot called');
    this.diagnostic.isLocationEnabled()
      .then((enabled: boolean) => {
        if (enabled) {
          this.navCtrl.setRoot(HomePage, { 'allChecked': true }, { animate: true, direction: 'forward' });
        } else {
          this.navCtrl.setRoot("GpsOffPage", {}, { animate: true, direction: 'forward' });
        }
      });
  }

  debugAlert(msg: string) {
    const alert = this.alertCtrl.create({
      message: JSON.stringify(msg)
    });
    alert.present();
  }
}

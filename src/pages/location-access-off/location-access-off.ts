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

  denied_always = false;
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
    this.denied_always = this.navParams.get('status') == this.diagnostic.permissionStatus.DENIED_ALWAYS;
  }

  ionViewDidEnter() {
    // listen to resume event for recheckingn the 
    this.resumeSubscription = this.platform.resume
      .subscribe((res) => {
        this.debugAlert('RESUME SUCCESSFULL');
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
    this.resumeSubscription.unsubscribe();
  }

  onAllowBtn() {
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
  }



  requestLocationPermission() {

    this.debugAlert('request location permission called');

    this.diagnostic.requestLocationAuthorization()
      .then((status) => {
        this.debugAlert(JSON.stringify(status));
        this.resuming = false;
        switch (status) {
          case this.diagnostic.permissionStatus.GRANTED:
            this.checkLocationEnabledOrNot();
            break;

          case this.diagnostic.permissionStatus.DENIED:
            console.log("Permission denied");
            break;

          // android only
          case this.diagnostic.permissionStatus.DENIED_ALWAYS:
            console.log("Permission denied");
            this.denied_always = true;
            break;

          case this.diagnostic.permissionStatus.NOT_REQUESTED:
            this.debugAlert('Not requested');
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
    this.debugAlert('checkLocationEnabledOrNot called');
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

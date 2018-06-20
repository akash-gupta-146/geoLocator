import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HomePage } from '../home/home';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';



@IonicPage()
@Component({
  selector: 'page-location-access-off',
  templateUrl: 'location-access-off.html',
})
export class LocationAccessOffPage {

  denied_always = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private diagnostic: Diagnostic,
    private openNativeSettings: OpenNativeSettings
  ) {
    this.denied_always = this.navParams.get('status') == this.diagnostic.permissionStatus.DENIED_ALWAYS;
  }

  onAllowBtn() {
    if (this.denied_always) {
      // open settings
      // this.diagnostic.switchToLocationSettings();
      this.openNativeSettings.open('application_details')
        .then(() => { 
          alert('back to app');
        })
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

    this.diagnostic.requestLocationAuthorization()
      .then((status) => {
        alert(JSON.stringify(status));
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
            alert('Not requested');
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
    this.diagnostic.isLocationEnabled()
      .then((enabled: boolean) => {
        if (enabled) {
          this.navCtrl.setRoot(HomePage, { 'allChecked': true }, { animate: true, direction: 'forward' });
        } else {
          this.navCtrl.setRoot("GpsOffPage", {}, { animate: true, direction: 'forward' });
        }
      });
  }
}

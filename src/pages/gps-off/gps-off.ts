import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { HomePage } from '../home/home';
import { Subscription } from 'rxjs/Subscription';



@IonicPage()
@Component({
  selector: 'page-gps-off',
  templateUrl: 'gps-off.html',
})
export class GpsOffPage {

  isIOS = false;
  resumeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform

  ) {
    this.isIOS = this.platform.is('ios');
  }

  ionViewDidEnter() {

    if (this.platform.is('ios')) {

      // check gps status on page load as there will be no TURN IN GPS BTN IN IOS CASE
      this.onEnableGPSBtn();
      this.subscribeToResumeEvent();
    }
  }

  ionViewWillLeave() {
    this.resumeSubscription.unsubscribe();
  }


  subscribeToResumeEvent() {

    // listen to resume event for rechecking the GPS status 
    this.resumeSubscription = this.platform.resume.subscribe((res) => {

      this.debugAlert('RESUME SUCCESSFULL');
      this.onEnableGPSBtn();
    }, (err) => {
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Error in checking status of location access',
        message: 'Please restart the app'
      });
      alert.present();
    });
  }

  onEnableGPSBtn() {


    this.locationAccuracy.canRequest()
      .then((canRequest: boolean) => {

        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then((res) => {
              this.debugAlert('Request successful' + JSON.stringify(res));
              // this.onClockIn();
              !this.isIOS && this.navCtrl.setRoot(HomePage, { 'allChecked': true }, { animate: true, direction: 'forward' });
            }, (error) => {
              this.debugAlert(JSON.stringify(error));

            });
        } else {
          if (this.isIOS) {
            // in IOS canRequest is false if GPS is ON
            // this will be the case when user has come back to app from settings and turned ON the GPS
            // now clock in is allowed, hence switch home  page
            this.navCtrl.setRoot(HomePage, { 'allChecked': false }, { animate: true, direction: 'forward' });
          } else {

            this.debugAlert('Can request : FALSE');
          }
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

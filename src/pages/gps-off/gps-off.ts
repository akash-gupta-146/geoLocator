import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-gps-off',
  templateUrl: 'gps-off.html',
})
export class GpsOffPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private locationAccuracy: LocationAccuracy

  ) {
  }

  onEnableGPSBtn() {
    this.locationAccuracy.canRequest()
      .then((canRequest: boolean) => {

        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then((res) => {
              alert('Request successful' + JSON.stringify(res));
              // this.onClockIn();
              this.navCtrl.setRoot(HomePage,{'allChecked':true},{animate:true,direction:'forward'});
            }, (error) => {
              
              alert(JSON.stringify(error));
            });
        } else {

          alert('Can request : FALSE');
        }

      });
  }
}

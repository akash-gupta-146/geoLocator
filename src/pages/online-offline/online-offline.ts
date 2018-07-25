import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomHttpService } from '../../providers/custom-http.service';
import { LoginPage } from '../login/login';
import { CustomService } from '../../providers/custom.service';


@Component({
  selector: 'page-online-offline',
  templateUrl: 'online-offline.html',
})
export class OnlineOfflinePage {

  mode = 'online';
  ipAddress = '';

  constructor(
    public navCtrl: NavController,
    private customHttpService: CustomHttpService,
    private customService:CustomService
  ) { }

  onGoToLogin() {
    this.navCtrl.push(LoginPage,{'pushed':true})
      .then(() => { this.setBaseurl(); })
      .catch((err)=>{this.customService.showToast(JSON.stringify(err));});
  }

  setBaseurl(){
    if(this.mode=='online'){
      this.customHttpService.BASEURL = this.customHttpService.ONLINE_BASEURL;
    }else{
      this.customHttpService.OFFLINE_BASEURL = `${this.ipAddress}`;
      this.customHttpService.BASEURL = this.customHttpService.OFFLINE_BASEURL;
    }
  }

}

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
  ipAddress = 'http://192.168.1.10:8080';

  constructor(
    public navCtrl: NavController,
    private customHttpService: CustomHttpService,
    private customService: CustomService
  ) { }

  onGoToLogin() {
    if (this.mode == 'offline' && !this.isIpValid()) { this.customService.showToast('Please enter a valid IP address'); return; }

    this.navCtrl.push(LoginPage, { 'pushed': true })
      .then(() => { this.setBaseurl(); })
      .catch((err) => { this.customService.showToast(JSON.stringify(err)); });
  }

  isIpValid() {
    if (!(this.ipAddress.startsWith('http://') || this.ipAddress.startsWith('https://'))) {
      return false;
    }

    const ipAddressPartWithPort = this.ipAddress.slice(this.ipAddress.lastIndexOf('/') + 1);
    const ipAddressPart =ipAddressPartWithPort.slice(0,ipAddressPartWithPort.indexOf(':'));
    console.log(ipAddressPart);

    const re = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!re.test(ipAddressPart)) {
      return false;
    }

    return true;
  }

  setBaseurl() {
    if (this.mode == 'online') {
      this.customHttpService.BASEURL = this.customHttpService.ONLINE_BASEURL;
    } else {
      this.customHttpService.OFFLINE_BASEURL = `${this.ipAddress}`;
      this.customHttpService.BASEURL = this.customHttpService.OFFLINE_BASEURL;
    }
  }

}

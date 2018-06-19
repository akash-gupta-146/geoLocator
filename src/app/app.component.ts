import { Component } from '@angular/core';
import { Platform, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserSessionManage } from '../Classes/user-session-manage';
import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';
import { CustomService } from '../providers/custom.service';

@Component({
  templateUrl: 'app.html'
})

export class MyApp extends UserSessionManage {


  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public events: Events,
    public appCtrl: App,
    public authService: AuthService,
    public networkService: NetworkService,
    public customService: CustomService) {

    super(events, appCtrl, authService, networkService, customService);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}


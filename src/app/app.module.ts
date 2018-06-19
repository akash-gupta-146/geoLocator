import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';
import { CustomHttpService } from '../providers/custom-http.service';
import { CustomService } from '../providers/custom.service';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [   
    MyApp,
    HomePage,
    LoginPage
  ],   
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    Network,
    NetworkService,
    CustomHttpService,
    CustomService
  ]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GpsOffPage } from './gps-off';

@NgModule({
  declarations: [
    GpsOffPage,
  ],
  imports: [
    IonicPageModule.forChild(GpsOffPage),
  ],
})
export class GpsOffPageModule {}

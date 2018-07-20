import { Component } from '@angular/core';
import {  NavController,  Events, MenuController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomService } from '../../providers/custom.service';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  submitAttempt = false;
  pushed = false; // indicates wheather login page is pushed from onlin-offline page or directly set root

  constructor(
    public navCtrl: NavController,
    private navParams:NavParams,
    public formBuilder: FormBuilder,
    private customService: CustomService,
    private authService: AuthService,
    private events: Events,
    private menu: MenuController,
  ) {
    this.pushed = this.navParams.get('pushed');
  }


  ngOnInit() {
    this.menu.swipeEnable(false);
    this.loginForm = this.formBuilder.group({
      username: ['assessor1', Validators.required],
      password: ['mazel tov', Validators.required]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }


  login() {

    this.submitAttempt = true;

    if (this.loginForm.valid) {

      this.customService.showLoader("Authenticating...");
      this.authService.login(this.loginForm.value)
        .subscribe((res: any) => {

          this.customService.hideLoader();
          this.authService.saveToken(res.token);
          this.navigate();

        }, (err) => {

          this.customService.hideLoader();
          this.loginFailed(err);
        });
    }
  }

  navigate() {
    this.events.publish('user:login');
  }

  loginFailed(err) {

    this.customService.showToast(err.msg);
  }

  onGoBack(){this.navCtrl.pop();}

}

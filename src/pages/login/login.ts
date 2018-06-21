import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, FabList, ModalController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private customService: CustomService,
    private authService: AuthService,
    private events: Events,
    private menu: MenuController,
    private modalCtrl: ModalController
  ) {
  }


  ngOnInit() {
    this.menu.swipeEnable(false);
    this.loginForm = this.formBuilder.group({
      username: ['mahesh.kumar', Validators.required],
      password: ['12345678', Validators.required]
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

}

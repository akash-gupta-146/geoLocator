import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, FabList, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomService } from '../../providers/custom.service';
import { AuthService } from '../../providers/auth.service';

@IonicPage()
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
      contactNo: ['8527466046', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      password: ['q', Validators.required]
    });
  }

  get contactNo() { return this.loginForm.get('contactNo'); }
  get password() { return this.loginForm.get('password'); }



  login() {

    this.submitAttempt = true;

    if (this.loginForm.valid) {
              this.navigate(); // REMOVE FROM HERE

    //   this.customService.showLoader("Authenticating...");
    //   this.authService.login(this.loginForm.value)
    //     .subscribe((res: any) => {

    //       this.authService.saveToken(res.access_token);

    //       this.authService.fetchUserDetails()
    //         .subscribe((res: any) => {
    //           this.customService.hideLoader();
    //           this.authService.saveUserDetails(res);
    //           this.navigate();
    //         }, (err) => {

    //           this.customService.hideLoader();
    //           this.customService.showToast(err.msg);
    //           localStorage.clear();
    //         });
    //     }, (err) => {
          
    //       this.customService.hideLoader();
    //       this.loginFailed(err);
    //     });
    }
  }

  navigate() {
    this.events.publish('user:login');
  }


  loginFailed(err) {

    if (err.status == 400) {
      this.customService.showToast("Contact No. or Password is invalid");
    } else {
      this.customService.showToast(err.msg);
    }
  }

  // onRegister() {
  //   const modal = this.modalCtrl.create("RegisterPage");
  //   modal.present();
  // }

}

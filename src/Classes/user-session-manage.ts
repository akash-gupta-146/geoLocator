import {  Events, App } from 'ionic-angular';
import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';
import { CustomService } from '../providers/custom.service';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

export class UserSessionManage {

    rootPage: any;

    constructor(
        public events: Events,
        public appCtrl: App,
        public authService: AuthService,
        public networkService: NetworkService,
        public customService: CustomService
    ) {

        this.handleEvents();
        this.networkService.checkNetworkStatus();
        this.hasLoggedIn();     
    }

    public handleEvents() {
        this.events.subscribe('user:login', () => {
            this.login();
        });
        this.events.subscribe('user:logout', () => {
            this.logout();
        });
        this.events.subscribe("offline", () => {
            this.offline();
        });
        this.events.subscribe("online", () => {
            this.online();
        });
     
    }


    public hasLoggedIn() {
        if (this.authService.isLoggedIn()) {
            this.rootPage = HomePage;
            // this.authService.fetchUserDetails()
            //     .subscribe((res) => {
            //         // no need to do any thing as userdetails would have been saved in service
            //         this.decideSideMenuContent();
            //         this.menu.enable(true);
            //         // this.enablePushNotifications();
            //     }, (err: any) => {
            //         this.customService.showToast('Some error occured, Please Reopen the App or Logout');
            //     });

        } else {
            this.rootPage = LoginPage;
        }
    }

    public login() {
        this.appCtrl.getRootNavs()[0].setRoot(HomePage,{},{animate:true,direction:'forward'});
    }



    public logout() {
        localStorage.clear();
        this.appCtrl.getRootNavs()[0].setRoot(LoginPage,{},{animate:true,direction:'forward'});
    }

    public offline() {
    this.customService.showToast('You appears to be offline. Please check your internet .','top',true);
    }

    public online() {
        // if (this.authService.isLoggedIn()) {
        //     this.login();
        // } else {
        //     this.logout();
        // }
    }


}



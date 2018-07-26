import { Events, App } from 'ionic-angular';
import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';
import { CustomService } from '../providers/custom.service';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OnlineOfflinePage } from '../pages/online-offline/online-offline';

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
    }


    public hasLoggedIn() {
        // if condition will never be satisfied in this app we are logging out automatically after cloking in/out
        // so user will always land the login page on opening the app.
        // if (this.authService.isLoggedIn()) {
        //     this.rootPage = HomePage;
        // } else {
        //     // this.rootPage = LoginPage;
        // }
        this.rootPage = OnlineOfflinePage;
    }

    public login() {
        this.appCtrl.getRootNavs()[0].setRoot(HomePage, {}, { animate: true, direction: 'forward' });
    }

    public logout() {
        localStorage.clear();
        // if (localStorage.getItem('clockedIn') == 'true') {
        //     localStorage.removeItem('access_token');
        //     localStorage.removeItem('userName');
        // } else {
        // }
        this.appCtrl.getRootNavs()[0].setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
    }

    public offline() {
        this.customService.showToast('You appears to be offline. Please check your internet .', 'top', true);
    }

}



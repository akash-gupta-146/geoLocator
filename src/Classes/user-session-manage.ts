import { Events, App } from 'ionic-angular';
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
    }


    public hasLoggedIn() {

        if (this.authService.isLoggedIn()) {
            this.rootPage = HomePage;
        } else {
            this.rootPage = LoginPage;
        }
    }

    public login() {
        this.appCtrl.getRootNavs()[0].setRoot(HomePage, {}, { animate: true, direction: 'forward' });
    }

    public logout() {
        if (localStorage.getItem('clockedIn') == 'true') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('userName');
        } else {
            localStorage.clear();
        }
        this.appCtrl.getRootNavs()[0].setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
    }

    public offline() {
        this.customService.showToast('You appears to be offline. Please check your internet .', 'top', true);
    }

}



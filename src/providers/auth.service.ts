import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';

@Injectable()
export class AuthService {

    constructor(private http: CustomHttpService) { }


    login(loginCredentials: any) {

        return this.http.postForLogin('/login', loginCredentials);
    }

    isLoggedIn() {
        return localStorage.getItem('access_token') ? true : false;
    }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
    }

    isClockedIn() {
        return localStorage.getItem('clockedIn')=='true';
    }


    saveTimeAndLocation(clockedIn:boolean, time1: string,time2:string, location:any) {
        localStorage.setItem('clockedIn',clockedIn.toString() );
        localStorage.setItem('clockedInTime', time1);
        localStorage.setItem('clockedOutTime', time2);
        localStorage.setItem('lastLocation', JSON.stringify(location));
    }

}

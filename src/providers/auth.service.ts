import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';

import jwt_decode from 'jwt-decode';


@Injectable()
export class AuthService {

    constructor(private http: CustomHttpService) { }


    login(loginCredentials: any) {

        return this.http.postForLogin('/login', loginCredentials);
    }

    logout() {
        return this.http.post('/api/user/logout',{});
    }

    isLoggedIn() {
        return localStorage.getItem('access_token') ? true : false;
    }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
        const userName = jwt_decode(token)['sub'];
        localStorage.setItem('userName', userName);
    }

    isClockedIn() {
        return localStorage.getItem('clockedIn') == 'true';
    }

    uploadClockInLocation(payLoad: any) {
        payLoad['username'] = localStorage.getItem('userName');
        // alert(JSON.stringify(payLoad));
        return this.http.post('/api/user/self/clockin', payLoad)
    }

    uploadClockOutLocation(payLoad: any) {
        payLoad['userName'] = localStorage.getItem('userName');
        // alert(JSON.stringify(payLoad));
        return this.http.put('/api/user/self/clockout', payLoad)
    }

    saveTimeAndLocation(clockedIn: boolean, time1: string, time2: string, location: any) {
        localStorage.setItem('clockedIn', clockedIn.toString());
        localStorage.setItem('clockedInTime', time1);
        localStorage.setItem('clockedOutTime', time2);
        localStorage.setItem('lastLocation', JSON.stringify(location));
    }

}

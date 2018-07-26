import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';

import jwt_decode from 'jwt-decode';


@Injectable()
export class AuthService {

    constructor(private http: CustomHttpService) { }


    login(loginCredentials: any) {

        return this.http.postForLogin('/mobileLogin', loginCredentials);
    }

    logout() {
        return this.http.post('/api/user/logout',{});
    }

    isLoggedIn() {
        return localStorage.getItem('access_token') ? true : false;
    }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
        // alert(JSON.stringify(token));
        const userName = jwt_decode(token)['sub'];
        // alert(JSON.stringify(userName));
        localStorage.setItem('userName', userName);
    }

    isClockedIn() {
        return localStorage.getItem('clockedIn') == 'true';
    }

    getClockInStatusFromServer(payLoad){
        return this.http.put('/api/user/self/getClockIn', payLoad)
    }

    uploadLocation(payLoad:any,forClockIn:boolean){
        if(forClockIn){ return this.uploadClockInLocation(payLoad);}
        else{return this.uploadClockOutLocation(payLoad);}
    }

    uploadClockInLocation(payLoad: any) {
        payLoad['username'] = localStorage.getItem('userName');
        // alert(JSON.stringify(payLoad));
        return this.http.post('/api/user/self/clockin', payLoad)
    }

    uploadClockOutLocation(payLoad: any) {
        payLoad['username'] = localStorage.getItem('userName');
        // alert(JSON.stringify(payLoad));
        return this.http.put('/api/user/self/clockout', payLoad)
    }

    saveTimeAndLocation(clockedIn:boolean,time: string ,location: any) {
        localStorage.setItem('clockedIn', JSON.stringify(clockedIn));
        localStorage.setItem('clockedInTime', time);
        localStorage.setItem('lastLocation', JSON.stringify(location));
    }

}

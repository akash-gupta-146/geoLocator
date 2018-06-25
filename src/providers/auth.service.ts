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
        return localStorage.getItem('clockedInTime') ? true : false;
    }

    saveClockedInTime(time: string) {
        localStorage.setItem('clockedInTime', time);
    }

}

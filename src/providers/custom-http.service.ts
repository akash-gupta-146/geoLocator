import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class CustomHttpService {

     BASEURL='http://www.vocscale-dev.ap-south-1.elasticbeanstalk.com';

    constructor(private httpClient: HttpClient) { }

    private getAccessToken() {

        return 'Bearer ' + localStorage.getItem('access_token');
    }

    private addHeaders(optionalHeaders?: HttpHeaders) {

        let requestHeaders = new HttpHeaders()
            .set('Authorization', this.getAccessToken());

        if (optionalHeaders) {
            for (const header of optionalHeaders.keys()) {
                requestHeaders = requestHeaders.append(header, optionalHeaders.get(header));
            }
        }
        return requestHeaders;
    }

    get(url: string, options?: HttpHeaders) {

        const headers = this.addHeaders(options);

        return this.httpClient.get(this.BASEURL + url, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }

    post(url: string, body: any, options?: HttpHeaders) {

        const headers = this.addHeaders(options);

        return this.httpClient.post(this.BASEURL + url, body, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }

    put(url: string, body: any, options?: HttpHeaders) {

        const headers = this.addHeaders(options);

        return this.httpClient.put(this.BASEURL + url, body, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }

    postForLogin(url: string, body: any) {
        // no header is required for register 
        return this.httpClient.post(this.BASEURL + url, body, { observe: 'response' })
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: HttpResponse<any>) {

        // console.log('inside extract data', res);
        return res.body || res.status;
    }

    private handleError(err: HttpErrorResponse) {
        // console.log('inside handle error', err);
        let errorInfo: any = {};

        if (err.error instanceof Error || err.error instanceof ProgressEvent) {
            /**A client-side or network error occurred. Handle it accordingly.*/
            // console.log('An error occurred:', );
            errorInfo.status = err.status;
            errorInfo.status == 0 ? errorInfo.msg = "No Internet, Check Your connection Or Try again" : errorInfo.msg = err.message || 'Some Error Occured';
        }
        else {
            /**The backend returned an unsuccessful response code.*/
            // console.log('Server occurred:', err);
            errorInfo.status = err.status;
            errorInfo.msg = err.error.message || err.error.error || 'Internal Server Error';
        }
        return Observable.throw(errorInfo);

    }



}

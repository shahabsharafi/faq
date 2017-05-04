import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from './index';

@Injectable()
export class BaseService<T> {
    
    protected headers: Headers;
    protected options: RequestOptions;

    constructor(
        protected http: Http,
        protected authenticationService: AuthenticationService,
        protected baseUrl)
    {            
            // add authorization header with jwt token
            this.headers = new Headers({ 'x-access-token': this.authenticationService.token });
            this.options = new RequestOptions({ headers: this.headers });
    }
    
    getList(): Promise<T[]> {
        return this.http.get(this.baseUrl, this.options)
                .toPromise()
                .then(res => <T[]> res.json())
                .then(data => { return data; });
    }

}

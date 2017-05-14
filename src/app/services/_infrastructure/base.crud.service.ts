import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AuthenticationService, BaseTokenService } from './index';

@Injectable()
export class BaseCrudService<T> extends BaseTokenService {

    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http,
        private baseUrl)
    {
            super(authenticationService);
    }

    getList(): Promise<T[]> {
        return this.http.get(this.baseUrl, this.options)
                .toPromise()
                .then(res => <T[]> res.json())
                .then(data => { return data; });
    }

    getItem(id): Promise<T> {
        return this.http.get(this.baseUrl + '/item/' + id, this.options)
                .toPromise()
                .then(res => <T> res.json())
                .then(data => { return data; });
    }

    save(obj: T): Promise<T> {
        return this.http.post(this.baseUrl, obj, this.options)
                .toPromise()
                .then(res => <T> res.json())
                .then(data => { return data; });
    }

    remove(obj: T): Promise<string> {
        return this.http.delete(this.baseUrl + '/item/' + this.getKey(obj), this.options)
                .toPromise()
                .then(res => res.json())
                .then(data => { return data; });
    }

    map(src, dst: T): void {
        
    } 
    
    getKey(obj: T): any {
        return null;
    }
}
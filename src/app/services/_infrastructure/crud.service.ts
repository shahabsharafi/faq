import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Pagination } from './../../models/index';
import { AuthenticationService, TokenService } from './index';

@Injectable()
export class CrudService<T> extends TokenService {

    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http,
        private baseUrl)
    {
            super(authenticationService);
    }

    /*
        Parameter:
            option: {
                query: { 'profile.name': 'Ghost' },
                select: { username: 1 },
                sort: { username: -1 },
                offset: 0 or page: 1,
                limit: 10
            }
        Result:
            {
                docs: {...}
                total: 152
                limit: 10
                page: 1
                pages:16
            }
    */
    getList(options: any): Promise<T[]> {
        return this.http.get(this.baseUrl, this.options)
                .toPromise()
                .then(res => <T[]> res.json())
                .then(data => { return data; });
    }

    getPagedList(options: any): Promise<Pagination<T>> {
        this.options.params = options;
        return this.http.get(this.baseUrl, this.options)
                .toPromise()
                .then(res => <Pagination<T>> res.json())
                .then(data => { return data; });
    }

    getItem(id, options): Promise<T> {
        this.options.params = options;
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

    copy(src): T {
        return null;
    }

    getKey(obj: T): any {
        return null;
    }
}

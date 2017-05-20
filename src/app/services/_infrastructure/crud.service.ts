import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Pagination } from './../../models/index';
import { AuthenticationService } from './index';

@Injectable()
export class CrudService<T> {

    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http,
        private baseUrl)
    {

    }

    getOption(params: any): RequestOptions{
        var headers: Headers = new Headers({ 'x-access-token': this.authenticationService.token });
        var options: RequestOptions = new RequestOptions({ headers: headers });
        if (params)
            options.params = params;
        return options;
    }

    getList(): Promise<T[]> {
        var options = this.getOption(null);
        return this.http.get(this.baseUrl, options)
                .toPromise()
                .then(res => <T[]> res.json())
                .then(data => { return data; });
    }

    getPagedList(params: any): Promise<Pagination<T>> {
        var options = this.getOption(params);
        return this.http.get(this.baseUrl, options)
                .toPromise()
                .then(res => <Pagination<T>> res.json())
                .then(data => { return data; });
    }

    getItem(id, params): Promise<T> {
        var options = this.getOption(params);
        return this.http.get(this.baseUrl + '/item/' + id, options)
                .toPromise()
                .then(res => <T> res.json())
                .then(data => { return data; });
    }

    save(obj: T): Promise<T> {
        var options = this.getOption(null);
        return this.http.post(this.baseUrl, obj, options)
                .toPromise()
                .then(res => <T> res.json())
                .then(data => { return data; });
    }

    remove(obj: T): Promise<string> {
        var options = this.getOption(null);
        return this.http.delete(this.baseUrl + '/item/' + this.getKey(obj), options)
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

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
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

}

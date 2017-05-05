import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../models/index';
import { AuthenticationService, BaseService } from './index';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        protected http: Http,
        protected authenticationService: AuthenticationService)
    {
        super(http, authenticationService, '/api/user/users');
    }

}

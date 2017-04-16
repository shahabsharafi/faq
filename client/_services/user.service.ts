import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AuthenticationService } from './index';
import { User } from '../_models/index';
import { BaseService } from './base.service';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        protected http: Http,
        protected authenticationService: AuthenticationService) 
    {
        super(http, authenticationService, '/api/user/users');
    }
}
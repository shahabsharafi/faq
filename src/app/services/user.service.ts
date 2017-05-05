import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { User } from '../models/index';
import { AuthenticationService, BaseCrudService } from './index';

@Injectable()
export class UserService extends BaseCrudService<User> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/user/users');
    }

}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Account } from '../models/index';
import { AuthenticationService, BaseCrudService } from './index';

@Injectable()
export class AccountService extends BaseCrudService<Account> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/accounts');
    }
    
    map(src, dst: Account) {
        super.map(src, dst);
        dst._id = src._id;
        dst.username = src.username;
        dst.firstName = src.profile.firstName;
        dst.lastName = src.profile.lastName;
        dst.access = src.access;
    }
    
    getKey(obj: Account): any {
        return obj._id;
    }

}

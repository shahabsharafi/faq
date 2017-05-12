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
        Object.assign(dst, src);
    }
    
    getKey(obj: Account): any {
        return obj._id;
    }

}

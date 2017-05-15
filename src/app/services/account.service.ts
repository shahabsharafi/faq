import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Account } from '../models/index';
import { AuthenticationService, CrudService } from './index';

@Injectable()
export class AccountService extends CrudService<Account> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/accounts');
    }
    
    copy(src): Account {
        var dst = new Account();
        Object.assign(dst, src);
        return dst;
    }
    
    getKey(obj: Account): any {
        return obj._id;
    }

}

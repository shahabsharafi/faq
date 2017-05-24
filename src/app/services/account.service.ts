import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Account } from '../models/index';
import { AuthenticationService, CrudService } from './index';
import { CalendarConvertor } from '../_infrastructure/index';

//declare var JalaliDate: any;

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
        dst.profile.birthDay = CalendarConvertor.gregorianToJalali(dst.profile.birthDay);
        return dst;
    }
    
    beforSave(obj: Account): void {
        obj.profile.birthDay = CalendarConvertor.jalaliToGregorian(obj.profile.birthDay);
    }

    getKey(obj: Account): any {
        return obj._id;
    }

}

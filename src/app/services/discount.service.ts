import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Discount } from '../models/index';
import { AuthenticationService, CrudService } from './index';
import { CalendarConvertor } from '../_infrastructure/index';

@Injectable()
export class DiscountService extends CrudService<Discount> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/discounts');
    }

    copy(src): Discount {
        var dst = <Discount>{};
        Object.assign(dst, src);
        dst.beginDate = CalendarConvertor.gregorianToJalali(dst.beginDate);
        dst.expireDate = CalendarConvertor.gregorianToJalali(dst.expireDate);
        return dst;
    }

    beforSave(obj: Discount): void {
        const currentInfo = this.authenticationService.getCurrentInfo();
        obj.owner = currentInfo.account;
        obj.beginDate = CalendarConvertor.jalaliToGregorian(obj.beginDate);
        obj.expireDate = CalendarConvertor.jalaliToGregorian(obj.expireDate);
    }

    getKey(obj: Discount): any {
        return obj._id;
    }
}

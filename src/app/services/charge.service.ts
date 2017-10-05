import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Charge } from '../models/index';
import { AuthenticationService, CrudService } from './index';
import { CalendarConvertor } from '../_infrastructure/index';

@Injectable()
export class ChargeService extends CrudService<Charge> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/charges');
    }

    copy(src): Charge {
        var dst = <Charge>{};
        Object.assign(dst, src);
        dst.createDate = CalendarConvertor.jalaliToGregorian(src.createDate);
        return dst;
    }

    beforSave(obj: Charge): void {
        obj.createDate = CalendarConvertor.jalaliToGregorian(obj.createDate);
    }

    afterLoad(list: Charge[]): void {
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                obj.createDate = CalendarConvertor.jalaliToGregorian(obj.createDate);
            }
        }
    }

    getKey(obj: Charge): any {
        return obj._id;
    }
}

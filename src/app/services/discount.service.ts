import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Discount } from '../models/index';
import { AuthenticationService, CrudService } from './index';

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
        return dst;
    }

    getKey(obj: Discount): any {
        return obj._id;
    }
}

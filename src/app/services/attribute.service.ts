import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Attribute } from '../models/index';
import { AuthenticationService, CrudService } from './index';

@Injectable()
export class AttributeService extends CrudService<Attribute> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/attributes');
    }

    copy(src): Attribute {
        var dst = <Attribute>{};
        Object.assign(dst, src);
        return dst;
    }

    getKey(obj: Attribute): any {
        return obj._id;
    }
}

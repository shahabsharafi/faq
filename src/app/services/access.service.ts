import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Access } from '../models/index';
import { AuthenticationService, BaseCrudService } from './index';

@Injectable()
export class AccessService extends BaseCrudService<Access> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/access');
    }
    
    map(src, dst: Access) {
        super.map(src, dst);
    }
    
    getKey(obj: Access): any {
        return null;
    }

}


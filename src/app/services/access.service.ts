import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Access } from '../models/index';
import { AuthenticationService, CrudService } from './index';

@Injectable()
export class AccessService extends CrudService<Access> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/access');
    }

}


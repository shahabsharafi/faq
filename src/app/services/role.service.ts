import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Role } from '../models/index';
import { AuthenticationService, BaseCrudService } from './index';

@Injectable()
export class RoleService extends BaseCrudService<Role> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/roles');
    }

    map(src, dst: Role) {
        super.map(src, dst);
        dst._id = src._id;
        dst.name = src.name;
        dst.access = src.access;
    }
    
    getKey(obj: Role): any {
        return obj._id;
    }
}

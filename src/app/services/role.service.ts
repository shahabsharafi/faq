import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Role } from '../models/index';
import { AuthenticationService, CrudService } from './index';

@Injectable()
export class RoleService extends CrudService<Role> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/roles');
    }

    copy(src): Role {
        var dst = <Role>{};
        Object.assign(dst, src);
        return dst;
    }
    
    getKey(obj: Role): any {
        return obj._id;
    }
}

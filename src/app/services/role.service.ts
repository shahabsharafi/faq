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

    search(query: String): Promise<Role[]> {
        var opt = {
            $select: 'name',
            $filter: "startswith(name,'" + query + "')",
            $orderby: 'name'
        }
        return this.getPagedList(opt).then(data => { return <Role[]>data.docs });
    }
}

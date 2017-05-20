import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Department } from '../models/index';
import { AuthenticationService, CrudService } from './index';

@Injectable()
export class DepartmentService extends CrudService<Department> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/departments');
    }

    copy(src): Department {
        var dst = <Department>{};
        Object.assign(dst, src);
        return dst;
    }

    getKey(obj: Department): any {
        return obj._id;
    }
}

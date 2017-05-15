import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { MenuItem } from '../models/index';
import { AuthenticationService, CrudService } from './index';

@Injectable()
export class MenuService extends CrudService<MenuItem> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/menu');
    }

}

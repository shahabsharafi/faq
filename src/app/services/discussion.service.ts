import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Discussion } from '../models/index';
import { AuthenticationService, CrudService } from './index';

@Injectable()
export class DiscussionService extends CrudService<Discussion> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/discussions');
    }

    copy(src): Discussion {
        var dst = <Discussion>{};
        Object.assign(dst, src);
        return dst;
    }

    getKey(obj: Discussion): any {
        return obj._id;
    }
}

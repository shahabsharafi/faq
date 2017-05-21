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

    getType(typeName): Promise<Attribute[]> {
        var options = this.getOption(null);
        return this.http.get(this.baseUrl + '/type/' + typeName, options)
                .toPromise()
                .then(res => <Attribute[]> res.json())
                .then(data => { return data; });
    }

    getChildren(parentId): Promise<Attribute[]> {
        var options = this.getOption(null);
        return this.http.get(this.baseUrl + '/children/' + parentId, options)
                .toPromise()
                .then(res => <Attribute[]> res.json())
                .then(data => { return data; });
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

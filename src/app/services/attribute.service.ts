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

getByType(type: String, query: String): Promise<Attribute[]> {
        var q = "type eq '" + type + "'";
        var opt = {
            $select: 'caption,value',
            $filter: query ? ("startswith(caption,'" + query + "') and " + q) : q,
            $orderby: 'caption,value'
        }
        return this.getPagedList(opt).then(data => { return <Attribute[]> data.docs });
    }

getByParentId(parentId: String, query: String): Promise<Attribute[]> {
        var q = "parentId eq '" + parentId + "'";
        var opt = {
            $select: 'caption,value',
            $filter: query ? ("startswith(caption,'" + query + "') and " + q) : q,
            $orderby: 'caption,value'
        }
        return this.getPagedList(opt).then(data => { return <Attribute[]> data.docs });
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

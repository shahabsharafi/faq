import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ResourceService {

    protected data: any;

    constructor(private http: Http) { }

    load(): void {
        this.http.get('/resources/fa.json')
                .toPromise()
                .then(res => res.json())
                .then(data => { this.data = data; });
    }

    getCaption(key): string {
        return this.data[key] + ':';
    }
}

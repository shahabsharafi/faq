import { Injectable, Optional  } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

import { AuthenticationService } from './index';

@Injectable()
export class TokenService {

    protected headers: Headers;
    protected options: RequestOptions;

    constructor(protected authenticationService: AuthenticationService)
    {
            // add authorization header with jwt token
            this.headers = new Headers({ 'x-access-token': this.authenticationService.token });
            this.options = new RequestOptions({ headers: this.headers });
    }

}

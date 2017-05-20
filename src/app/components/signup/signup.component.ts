import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, ResourceService } from '../../services/index';
import { BaseComponent } from '../_infrastructure/index';

@Component({
    templateUrl: './signup.component.html',
})

export class SignupComponent extends BaseComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        protected resourceService: ResourceService)
    {
        super(resourceService);
    }

    ngOnInit() {
        super.ngOnInit();

    }

    signup() {

    }
}

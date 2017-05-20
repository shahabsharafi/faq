import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, ResourceService } from '../../services/index';
import { BaseComponent } from '../_infrastructure/index';

@Component({
    templateUrl: './signin.component.html',
})

export class SigninComponent extends BaseComponent implements OnInit {
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
        this.authenticationService.signout();
    }

    signin() {
        this.loading = true;
        this.authenticationService.signin(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['/#']);
                } else {
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
}

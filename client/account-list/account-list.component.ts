import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
    selector:'account-list',
    template: require('./account-list.component.html'),
})
export class AccountListComponent{
    users: User[] = [];

    constructor(private userService: UserService) {  }
    
    ngOnInit() {
        // get users from secure api end point
        this.userService.getList()
            .subscribe(users => {
                this.users = users;
            });
    }
    
}
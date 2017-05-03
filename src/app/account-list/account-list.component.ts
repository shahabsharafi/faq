import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent{
    users: User[] = [];

    constructor(private userService: UserService) {  }
    
    ngOnInit() {
        // get users from secure api end point
        this.userService.getList().then(users => this.users = users);
            //.subscribe(users => {
            //    this.users = users;
            //});
    }
    
}
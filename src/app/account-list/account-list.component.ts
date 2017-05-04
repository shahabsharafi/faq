import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService, Logger } from '../_services/index';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
    users: User[];

    constructor(private userService: UserService,
        protected logger: Logger) {  }
    
    ngOnInit() {
        this.userService.getList().then(users => this.users = users);
    }
    
}

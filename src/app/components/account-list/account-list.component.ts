import { Component, OnInit } from '@angular/core';

import { User } from '../../models/index';
import { UserService, ResourceService, Logger } from '../../services/index';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
    users: User[];
    userColumns: any[];

    constructor(private userService: UserService,
        protected logger: Logger,
        protected resourceService: ResourceService) {  }

    ngOnInit() {
        this.userColumns = [
            {field: 'username', header: this.resourceService.getCaption('username')},
            {field: 'firstName', header: this.resourceService.getCaption('firstName')},
            {field: 'lastName', header: this.resourceService.getCaption('lastName')}
        ];
        this.userService.getList().then(users => this.users = users);
    }

}

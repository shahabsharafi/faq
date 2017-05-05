import { Component, OnInit } from '@angular/core';

import { User } from '../../models/index';
import { UserService, ResourceService, Logger } from '../../services/index';
import { BaseComponent } from '../index';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent extends BaseComponent implements OnInit {
    users: User[];
    userColumns: any[];

    constructor(
        private userService: UserService,
        protected logger: Logger,
        protected resourceService: ResourceService)
    {
        super(resourceService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.userColumns = [
            {field: 'username', header: this.getHeader('username')},
            {field: 'firstName', header: this.getHeader('firstName')},
            {field: 'lastName', header: this.getHeader('lastName')}
        ];
        this.userService.getList().then(users => this.users = users);
    }

}

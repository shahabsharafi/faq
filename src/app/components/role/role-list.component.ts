import { Component, OnInit } from '@angular/core';

import { Role } from '../../models/index';
import { RoleService, ResourceService } from '../../services/index';
import { BaseComponent } from '../index';

@Component({
    selector:'role-list',
    templateUrl: './role-list.component.html',
})
export class RoleListComponent extends BaseComponent implements OnInit {
    roles: Role[];
    roleColumns: any[];

    constructor(
        private roleService: RoleService,
        protected resourceService: ResourceService)
    {
        super(resourceService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.roleColumns = [
            {field: 'name', header: this.getHeader('role-name')}
        ];
        this.roleService.getList().then(roles => this.roles = roles);
    }

}

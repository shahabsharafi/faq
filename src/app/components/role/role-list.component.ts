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
    selectedRole: Role = <Role>{};
    roleColumns: any[];

    constructor(
        private roleService: RoleService,
        protected resourceService: ResourceService)
    {
        super(resourceService);
    }

    load() {
        this.roleService.getList().then(roles => this.roles = roles);
    }

    clear() {
        this.selectedRole = <Role>{};
    }

    ngOnInit() {
        super.ngOnInit();
        this.roleColumns = [
            {field: 'name', header: this.getHeader('role-name')}
        ];
        this.load();
    }

    onRowSelect(event) {
        this.roleService.getItem(event.data._id).then(role => {
            this.selectedRole = {
                _id: role._id,
                name: role.name,
                access: null
            }
        });

    }

    onSave() {
        this.roleService.save(this.selectedRole).then(role => { this.load(); });
        this.clear();
    }

    onRemove() {
        this.roleService.remove(this.selectedRole._id).then(message => { this.load(); });
        this.clear();
    }

    onNew() {
        this.clear();
    }
}

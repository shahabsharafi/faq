import { Component, OnInit } from '@angular/core';

import { Role } from '../../models/index';
import { RoleService, ResourceService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';

@Component({
    selector:'role-list',
    templateUrl: './role-list.component.html',
})
export class RoleListComponent extends CrudComponent<Role> implements OnInit {
    
    constructor(
        private roleService: RoleService,
        protected resourceService: ResourceService)
    {
        super(resourceService, roleService);
    }

    ngOnInit() {
        this.cols = [
            {field: 'name', header: this.getCaption('role-name')}
        ];
        this.load();
    }

    onRowSelect(event) {
        this.selectOne(event.data._id);
    }

    onSave() {
        this.save();
    }

    onRemove() {
        this.remove();
    }

    onNew() {
        this.clear();
    }
}

import { Component, OnInit } from '@angular/core';

import { Role } from '../../models/index';
import { RoleService, ResourceService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent } from 'primeng/primeng';

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
        super.ngOnInit();
        this.cols = [
            {field: 'name', header: this.res.role_name, filter: 'true', filterMatchMode: 'contains', sortable: 'true'}
        ];
        this.load(null);
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event);
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
        this.item = <Role>{};
    }
}

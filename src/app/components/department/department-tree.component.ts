import { Component, OnInit } from '@angular/core';

import { Department } from '../../models/index';
import { DepartmentService, ResourceService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';

@Component({
    selector:'department-tree',
    templateUrl: './department-tree.component.html',
})
export class DepartmentTreeComponent extends CrudComponent<Department> implements OnInit {

    constructor(
        private departmentService: DepartmentService,
        protected resourceService: ResourceService)
    {
        super(resourceService, departmentService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.load(null);
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
        this.item = <Department>{};
    }
}

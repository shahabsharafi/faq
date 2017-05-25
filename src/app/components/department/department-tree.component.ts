import { Component, OnInit } from '@angular/core';

import { Department } from '../../models/index';
import { DepartmentService, ResourceService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector:'department-tree',
    templateUrl: './department-tree.component.html',
})
export class DepartmentTreeComponent extends CrudComponent<Department> implements OnInit {

    _parentId: String;

    constructor(
        private departmentService: DepartmentService,
        protected resourceService: ResourceService)
    {
        super(resourceService, departmentService);
    }

    getOption(): any {
        var filters: { [s: string]: any; } = {};
        if (this._parentId) {
            filters["parentId"] = { value: this._parentId, matchMode: "equals" };
        } else {
            filters["type"] = { value: "department", matchMode: "equals" };
        }
        return { filters: filters };
    }

    ngOnInit() {
        super.ngOnInit();
        this.load(this.getOption());
    }

    loadCarsLazy(event: LazyLoadEvent) {
        if (this._parentId)
            event.filters["parentId"] = { value: this._parentId, matchMode: "equals" };
        this.load(event);
    }

    go(id) {
        this._parentId = id;
        this.load(this.getOption());
    }

    onRowSelect(event) {
        this.selectOne(event.data._id);
    }

    onSave() {
        this.save(this.getOption());
    }

    onRemove() {
        this.remove(this.getOption());
    }

    onNew() {
        this.clear();
        this.item = <Department>{};
    }
}

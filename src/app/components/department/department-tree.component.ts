import { Component, OnInit } from '@angular/core';

import { Department } from '../../models/index';
import { DepartmentService, ResourceService, RoleService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector:'department-tree',
    templateUrl: './department-tree.component.html',
})
export class DepartmentTreeComponent extends CrudComponent<Department> implements OnInit {

    _parentId: String;
    _chain: any[];
    _items: any[];
    roles: any[];

    constructor(
        private departmentService: DepartmentService,
        protected resourceService: ResourceService,
        protected roleService: RoleService)
    {
        super(resourceService, departmentService);
        this._chain = [];
        this._items = [];
    }

    onLoad() {
        var addItem = <Department> {};
        addItem.type = 'new';
        addItem.description = 'for add';
        var arr = [addItem];
        this.list = arr.concat(this.list);
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

    go(event) {
        this._items.push({ label: event.caption });
        this._chain.push(event);
        this._parentId = event._id;
        this.load(this.getOption());
    }

    back() {
        if (this._chain.length) {
            this._items.pop();
            var obj = this._chain.pop();
            this._parentId = obj.parentId;
            if (this._chain.length) {
                var p = this._chain[this._chain.length - 1];
            }
            this.load(this.getOption());
        }
    }

    onRowSelect(event) {
        this.selectOne(event._id, { expand: 'roles' });
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
        this.item.tags = [];
        if (this._parentId) {
            this.item.type = 'category';
            this.item.parentId = this._parentId;
            this.item.selectable = true;
        } else {
            this.item.type = 'department';
            this.item.selectable = false;
        }
    }

    onSearchRole(event) {
        this.roleService.search(event.query).then(data => {
            this.roles = data;
        });
    }
}

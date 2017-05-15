import {Component, OnInit} from "@angular/core";
import { ResourceService, CrudService } from './../../services/index';
import { BaseComponent } from './index';

export class CrudComponent<T> extends BaseComponent {
    list: T[];
    totalRecords: number;
    item: T;
    cols: any[];

    constructor (
        protected resourceService: ResourceService,
        protected service: CrudService<T>)
    { 
        super(resourceService);
    }

    clear() {
        this.item = null;
    }
    
    load() {
        this.service.getPagedList(null).then(data => {
            this.list = data.docs;
            this.totalRecords = data.total;
            this.onLoad();
        });
    }

    onLoad() {

    }

    selectOne(id) {
        this.service.getItem(id).then(item => {
            this.item = this.service.copy(item);
            this.onSelect();
        });
    }
    
    onSelect() {

    }

    save() {
        this.service.save(this.item).then(item => { this.load(); });
        this.clear();
    }

    remove() {
        this.service.remove(this.item).then(message => { this.load(); });
        this.clear();
    }

}

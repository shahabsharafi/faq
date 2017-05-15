import {Component, OnInit} from "@angular/core";
import { ResourceService, BaseCrudService } from './../../services/index';
import { BaseComponent } from './index';

export class CrudComponent<T> extends BaseComponent {
    list: T[];
    item: T;
    cols: any[];

    constructor (
        protected resourceService: ResourceService,
        protected service: BaseCrudService<T>) 
    { 
        super(resourceService);
    }

    clear() {
        this.item = null;
    }
    
    load() {
        this.service.getList(null).then(list => {
            this.list = list;
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

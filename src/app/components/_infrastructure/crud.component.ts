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

    getODataFilter(filters: { [s: string]: any; }): String {
        var filterString = '';
        for (var key in filters) {
            var filter = filters[key];
            if (filter.value != undefined) {
                    if (filterString)
                        filterString += '+and+';
                var field = key.replace(/\./, '_');
                switch (filter.matchMode) {
                    case 'contains':
                        filterString += "substringof(" + field + ",'" + filter.value + "')";
                        break;
                    case 'equals':
                        filterString += field + "+eq+'" + filter.value + "'";
                        break;
                    case 'endsWith':
                        filterString += "endswith(" + field + ",'" + filter.value + "')";
                        break;
                    default:
                        filterString += "startswith(" + field + ",'" + filter.value + "')";
                }
            }
        }
        if (filterString)
            filterString = '$filter=' + filterString;
        return filterString;
    }

    clear() {
        this.item = null;
    }
    
    load(option) {
        var opt = {};
        if (option) {
            var filterString = this.getODataFilter(option.filters);
            opt = {
                filters: filterString,
                sortField: option.sortField || '',
                sortOrder: option.sortOrder || 0,
                offset: option.first || 0,
                limit: option.rows || 10
            };
        }
        this.service.getPagedList(opt).then(data => {
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
        this.service.save(this.item).then(item => { this.load(null); });
        this.clear();
    }

    remove() {
        this.service.remove(this.item).then(message => { this.load(null); });
        this.clear();
    }

}

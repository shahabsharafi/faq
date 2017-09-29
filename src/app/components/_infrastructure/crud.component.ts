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
                        filterString += ' and ';
                var field = key.replace(/\./, '_');
                switch (filter.matchMode) {
                    case 'contains':
                        filterString += "substringof(" + field + ",'" + filter.value + "')";
                        break;
                    case 'equals':
                        filterString += field + " eq '" + filter.value + "'";
                        break;
                    case 'endsWith':
                        filterString += "endswith(" + field + ",'" + filter.value + "')";
                        break;
                    default:
                        filterString += "startswith(" + field + ",'" + filter.value + "')";
                }
            }
        }
        return filterString;
    }

    clear() {
        this.item = null;
    }
    
    load(option, extraOption = null) {
        var opt: any = {};
        if (option) {
            var filterString = this.getODataFilter(option.filters);
            if (filterString) opt.$filter = filterString;
            if (option.sortField) {
                var sortField = option.sortField.replace(/\./, '_');
                var expression = (option.sortOrder == -1 ? ' desc' : ' asc');
                opt.$orderby = sortField + expression;
            }
            if (option.first) opt.$top = option.first;
            if (option.rows) opt.$skip = option.rows;
        }
        if (extraOption) {
            if (extraOption.select) opt.$select = extraOption.select;
            if (extraOption.expand) opt.$expand = extraOption.expand;
        }
        this.service.getPagedList(opt).then(data => {
            this.list = data.docs;
            this.totalRecords = data.total;
            this.onLoad();
        });
    }
    /*var opt = {
            $filter: "startswith(" + query.field + ",'" + query.value + "')",
            &$orderby: query.field
        }
        service.getPagedList(opt).then(data => { if (callback) callback() });*/

    onLoad() {

    }

    selectOne(id, extraOption = null) {
        var opt: any = {};
        if (extraOption) {
            if (extraOption.select) opt.$select = extraOption.select;
            if (extraOption.expand) opt.$expand = extraOption.expand;
        }
        this.service.getItem(id, opt).then(item => {
            this.item = this.service.copy(item);
            this.onSelect();
        });
    }
    
    onSelect() {

    }

    save(option = null, extraOption = null) {
        this.service.beforSave(this.item);
        this.service.save(this.item).then(item => { this.load(option, extraOption); });
        this.clear();
    }

    remove(option = null, extraOption = null) {
        this.service.remove(this.item).then(message => { this.load(option, extraOption); });
        this.clear();
    }

}

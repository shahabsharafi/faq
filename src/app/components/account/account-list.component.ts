import { Component, OnInit } from '@angular/core';

import { Account, Profile, Contact, Education, Extra } from '../../models/index';
import { AccountService, ResourceService, AccessService } from '../../services/index';
import { BaseComponent, CrudComponent, TreeComponent } from '../index';
import { TreeNode, LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent extends CrudComponent<Account> implements OnInit {

    treeData: TreeNode[];
    caption: any;
    scrollWidth: String;
    
    constructor(
        private accountService: AccountService,
        protected resourceService: ResourceService,
        protected accessService: AccessService)
    {
        super(resourceService, accountService);

    }

    ngOnInit() {
        var me = this;
        super.ngOnInit();
        this.cols = [
            {field: 'username', header: this.res.account_username, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'profile.firstName', header: this.res.account_firstName, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'profile.lastName', header: this.res.account_lastName, filter: 'true', filterMatchMode: 'contains', sortable: 'true'}
        ];
        
        this.load();
        this.accessService.getList(null).then(list => {
            var _fn = function(list) {
                var accessList = [];
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var access = <TreeNode>{};
                    access.label = me.getCaption(obj.name);
                    access.data = obj.name;
                    if (obj.children) 
                        access.children = <TreeNode[]> _fn(obj.children);
                    accessList.push(access);
                }
                return accessList;
            }
            this.treeData = <TreeNode[]> _fn(list);
        });        
    }

    ngAfterViewInit() {
        var me = this;
        var m = $('.ui-datatable-scrollable-header-box').css('margin-right');
        if (m && m != '0px') {
            me.scrollWidth = m;
            $('.ui-datatable-scrollable-header-box').css({'margin-left': me.scrollWidth, 'margin-right': '0px'});
        }
        $('.ui-datatable-scrollable-body').on( "scroll", function () {
            $('.ui-datatable-scrollable-header-box').css({'margin-left': me.scrollWidth, 'margin-right': '0px'});
        });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
        var filterString = '';
        for (var key in event.filters) {
            var filter = event.filters[key];
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

        this.service.getPagedList({
            filters: filterString,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
            offset: event.first,
            limit: event.rows
        }).then(data => {
            this.list = data.docs;
            this.totalRecords = data.total;
            this.onLoad();
        });
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
        this.item = new Account();
    }

}

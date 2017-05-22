import { Component, OnInit } from '@angular/core';

import { Account, Attribute } from '../../models/index';
import { AccountService, ResourceService, AccessService, AttributeService } from '../../services/index';
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
    provinces: Attribute[];
    cities: Attribute[];
    grades: Attribute[];
    majors: Attribute[];
    universities: Attribute[];
    levels: Attribute[];
    
    constructor(
        private accountService: AccountService,
        protected resourceService: ResourceService,
        protected accessService: AccessService,
        protected attributeService: AttributeService)
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
        
        this.load(null);
        this.accessService.getList().then(list => {
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
        this.load(event, { expand: 'province,city' });
    }

    onSearchProvince(event) {
        this.attributeService.getByType('province', event.query).then(data => {
            this.provinces = data;
        });
    }

    onSelectProvince(event) {
        if (this.item && this.item.contact)
            this.item.contact.city = null;
    }

    onSearchCity(event) {
        if (this.item && this.item.contact && this.item.contact.province) {
            this.attributeService.getByParentId(this.item.contact.province._id, event.query).then(data => {
                this.cities = data;
            });
        }
    }

    onSearchGrade(event) {
        this.attributeService.getByType('grade', event.query).then(data => {
            this.grades = data;
        });
    }

    onSearchMajor(event) {
        this.attributeService.getByType('major', event.query).then(data => {
            this.majors = data;
        });
    }

    onSearchUniversity(event) {
        this.attributeService.getByType('university', event.query).then(data => {
            this.universities = data;
        });
    }

    onSearchLevel(event) {
        this.attributeService.getByType('level', event.query).then(data => {
            this.levels = data;
        });
    }

    onRowSelect(event) {
        this.selectOne(event.data._id, { expand: 'contact_province,contact_city,education_grade,education_major,education_university,education_level' });
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

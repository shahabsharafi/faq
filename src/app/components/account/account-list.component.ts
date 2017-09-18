import { Component, OnInit } from '@angular/core';

import { Account, Attribute } from '../../models/index';
import { AccountService, ResourceService, AccessService, AttributeService, RoleService } from '../../services/index';
import { BaseComponent, CrudComponent, TreeComponent, ComponentUtility } from '../index';
import { TreeNode, LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent extends CrudComponent<Account> implements OnInit {

    treeData: TreeNode[];
    caption: any;
    scrollWidth: String;
    sexes: Attribute[];
    states: Attribute[];
    jobStates: Attribute[];
    religions: Attribute[];
    sects: Attribute[];
    references: Attribute[];
    countries: Attribute[];
    provinces: Attribute[];
    cities: Attribute[];
    grades: Attribute[];
    majors: Attribute[];
    universities: Attribute[];
    levels: Attribute[];
    languages: Attribute[];
    dialects: Attribute[];
    roles: any[];
    
    _defaultSex: any;
    _defaultStatus: any;
    _defaultJobState: any;

    constructor(
        private accountService: AccountService,
        protected resourceService: ResourceService,
        protected accessService: AccessService,
        protected attributeService: AttributeService,
        protected roleService: RoleService)
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

        this.attributeService.getByType('sex', null).then(data => {
            if (data.length) {
                this._defaultSex = data[0];
            }
            this.sexes = ComponentUtility.getDropdownData(data);
        });
        this.attributeService.getByType('status', null).then(data => {
            if (data.length) {
                this._defaultStatus = data[0];
            }
            this.states = ComponentUtility.getDropdownData(data);
        });
        this.attributeService.getByType('job_state', null).then(data => {
            if (data.length) {
                this._defaultJobState = data[0];
            }
            this.jobStates = ComponentUtility.getDropdownData(data);
        });

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
        this.load(event, { expand: 'sex,status,jobState,religion,sect,reference,country,province,city' });
    }

    onSearchRole(event) {
        this.roleService.search(event.query).then(data => {
            this.roles = data;
        });
    }

    onSearchReligion(event) {
        this.attributeService.getByType('religion', event.query).then(data => {
            this.religions = data;
        });
    }

    onSearchSect(event) {
        this.attributeService.getByType('sect', event.query).then(data => {
            this.sects = data;
        });
    }

    onSearchReference(event) {
        this.attributeService.getByType('reference', event.query).then(data => {
            this.references = data;
        });
    }

    onSearchCountry(event) {
        this.attributeService.getByType('country', event.query).then(data => {
            this.countries = data;
        });
    }

    onSelectCountry(event) {
        if (this.item && this.item.contact)
            this.item.contact.province = null;
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

    onSearchLanguage(event) {
        this.attributeService.getByType('language', event.query).then(data => {
            this.languages = data;
        });
    }

    onSearchDialect(event) {
        this.attributeService.getByType('dialect', event.query).then(data => {
            this.dialects = data;
        });
    }

    onRowSelect(event) {
        this.selectOne(event.data._id, { expand: 'contact_country,contact_province,contact_city,education_grade,education_major,education_university,education_level,extra_language,extra_dialect,roles' });
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
        this.item.profile.sex = <{ _id: String, caption: String }>this._defaultSex;
        this.item.profile.status = <{ _id: String, caption: String }>this._defaultStatus;
        this.item.profile.jobState = <{ _id: String, caption: String }>this._defaultJobState;
    }

}

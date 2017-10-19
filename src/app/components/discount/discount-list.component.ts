import { Component, OnInit, ViewChild } from '@angular/core';

import { Discount, Department, Attribute, Account } from '../../models/index';
import { DiscountService, DepartmentService, ResourceService, AttributeService, AuthenticationService, AccountService } from '../../services/index';
import { BaseComponent, CrudComponent, ComponentUtility } from '../index';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { CalendarConvertor }  from '../../_infrastructure/index';
import { TreeviewHelper, TreeviewI18n, TreeviewItem, TreeviewConfig, DownlineTreeviewItem, DropdownTreeviewComponent } from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';
import * as _ from 'lodash'

@Component({
    selector:'discount-list',
    templateUrl: './discount-list.component.html',
    providers: [
        { provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }
    ]
})
export class DiscountListComponent extends CrudComponent<Discount> implements OnInit {

    typeCollection: Attribute[];
    types: SelectItem[];
    _defaultState: any;
    dropdownTreeviewConfig: any;
    categoryItems: TreeviewItem[];
    accounts: any[];

    @ViewChild(DropdownTreeviewComponent) dropdownTreeviewComponent: DropdownTreeviewComponent;
    private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

    constructor(
        public i18n: TreeviewI18n,
        protected authenticationService: AuthenticationService,
        private discountService: DiscountService,
        private departmentService: DepartmentService,
        protected resourceService: ResourceService,
        protected attributeService: AttributeService,
        protected accountService: AccountService)
    {
        super(resourceService, discountService);
        this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
    }

    ngOnInit() {
        super.ngOnInit();
        this.cols = [
            {field: 'owner.username', header: this.res.discount_owner, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'category.caption', header: this.res.discount_category, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'price', header: this.res.discount_price, filter: 'false', sortable: 'true'},
            {field: 'count', header: this.res.discount_count, filter: 'false', sortable: 'true'},
            {field: 'type.caption', header: this.res.discount_type, filter: 'false', sortable: 'true'}
        ];
        this.load(null, { expand: 'type,owner,category' });
        this.attributeService.getByType('discount_type', null).then(data => {
            if (data.length) {
                this._defaultState = <Attribute>{ _id: data[0]._id, value: data[0].value };
            }
            this.typeCollection = <Attribute[]>data;
            this.types = ComponentUtility.getDropdownData(data);
        });
         this.dropdownTreeviewConfig = TreeviewConfig.create({
            hasAllCheckBox: false,
            hasFilter: false,
            hasCollapseExpand: false,
            decoupleChildFromParent: false,
            maxHeight: 500
        });

        this.departmentService.getTree().then(data => {
            var _fn = function(list) {
                var items = new Array<TreeviewItem>();
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var item = obj.children
                        ? new TreeviewItem({
                            text: obj.caption,
                            value: obj._id,
                            children: <TreeviewItem[]> _fn(obj.children)
                        })
                        : new TreeviewItem({
                            text: obj.caption,
                            value: obj._id
                        });
                    items.push(item);
                }
                return items;
            }
            if (data) {
                var list = <Department[]>data;
                this.categoryItems = <TreeviewItem[]> _fn(list);
            }
        });
        /*
        this.categoryItems = [new TreeviewItem({
            text: 'Children', value: 1, collapsed: false, children: [
                { text: 'Baby 3-5', value: 11 },
                { text: 'Baby 6-8', value: 12 },
                { text: 'Baby 9-12', value: 13 }
            ]
        })];
        */
    }

    select(item: TreeviewItem) {
        this.dropdownTreeviewComponent.dropdownDirective.close();
        this.selectItem(item);
        var opt: any = {};
        this.departmentService.getItem(item.value, opt).then(o => {
            this.item.category = o;
        });
    }

    selectItem(item: TreeviewItem) {
        if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
            this.dropdownTreeviewSelectI18n.selectedItem = item;
        }
    }

    onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
        downlineItems.forEach(downlineItem => {
            const item = downlineItem.item;
        });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event, { expand: 'type,owner,category' });
    }

    onRowSelect(event) {
        this.selectOne(event.data._id, { expand: 'type,owner,category' });
    }

    onSelect() {
        if (this.item.category) {
            if (this.categoryItems && this.categoryItems.length) {
                const selectedItem = TreeviewHelper.findItemInList(this.categoryItems, this.item.category._id);
                if (selectedItem) {
                    this.selectItem(selectedItem);
                }
            }
        }
        $(document).ready(function () {
            $('.ui-dropdown-trigger').removeClass('ui-corner-right').addClass('ui-corner-left');
            $('.ui-dropdown-trigger').removeClass('ui-dropdown-trigger').addClass('ui-dropdown-trigger-rtl');
            $('.ui-dropdown-label').removeClass('ui-dropdown-label').addClass('ui-dropdown-label-rtl');
        });
    }

    onStateSelect(event){
        var type = _.find(this.typeCollection, { '_id': event.value });
        if (type && type.value && this.item.type.value != type.value) {
            this.item.type._id = type._id;
            this.item.type.value = type.value;
            if (type.value == 'limited') {
                this.item.expireDate = this.item.beginDate;
            } else {
                this.item.expireDate = null;
            }
        }
    }

    onSave() {
        this.save(null, { expand: 'type,owner,category' });
    }

    onRemove() {
        this.remove(null, { expand: 'type,owner,category' });
    }

    onNew() {
        this.clear();
        this.item = new Discount();
        var d = new Date();
        const currentInfo = this.authenticationService.getCurrentInfo();
        this.item.owner = currentInfo.account;
        this.item.category = <Department>{};
        this.item.type = <Attribute>this._defaultState;
        this.item.isOrganization = true;
        this.item.beginDate = CalendarConvertor.gregorianToJalali(d.toJSON());
        this.item.expireDate = CalendarConvertor.gregorianToJalali(d.toJSON());
    }

    onSearchAccount(event) {
        this.accountService.search(event.query).then(data => {
            this.accounts = data;
        });
    }
}

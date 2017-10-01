import { Component, OnInit, ViewChild } from '@angular/core';

import { Discount, Department, Attribute, Account } from '../../models/index';
import { DiscountService, DepartmentService, ResourceService, AttributeService, AuthenticationService } from '../../services/index';
import { BaseComponent, CrudComponent, ComponentUtility } from '../index';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { CalendarConvertor }  from '../../_infrastructure/index';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DownlineTreeviewItem, DropdownTreeviewComponent } from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';

@Component({
    selector:'discount-list',
    templateUrl: './discount-list.component.html',
    providers: [
        { provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }
    ]
})
export class DiscountListComponent extends CrudComponent<Discount> implements OnInit {

    states: SelectItem[];
    _defaultState: any;
    dropdownTreeviewConfig: any;
    categoryItems: TreeviewItem[];

    @ViewChild(DropdownTreeviewComponent) dropdownTreeviewComponent: DropdownTreeviewComponent;
    private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

    constructor(
        public i18n: TreeviewI18n,
        protected authenticationService: AuthenticationService,
        private discountService: DiscountService,
        private departmentService: DepartmentService,
        protected resourceService: ResourceService,
        protected attributeService: AttributeService)
    {
        super(resourceService, discountService);
        this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
    }

    ngOnInit() {
        super.ngOnInit();
        this.cols = [
            {field: 'owner', header: this.res.discount_owner, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'price', header: this.res.discount_price, filter: 'false', sortable: 'true'},
            {field: 'count', header: this.res.discount_count, filter: 'false', sortable: 'true'},
            {field: 'cover', header: this.res.discount_cover, filter: 'false', sortable: 'true'},
            {field: 'state.caption', header: this.res.discount_state, filter: 'false', sortable: 'true'}
        ];
        this.load(null, { expand: 'state' });
        this.attributeService.getByType('discount_state', null).then(data => {
            if (data.length) {
                this._defaultState = data[0];
            }
            this.states = ComponentUtility.getDropdownData(data);
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
        if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
            this.dropdownTreeviewSelectI18n.selectedItem = item;
            var opt: any = {};
            this.departmentService.getItem(item.value, opt).then(o => {
                this.item.category = o;
            });
        }
    }

    onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
        //this.rows = [];
        downlineItems.forEach(downlineItem => {
            const item = downlineItem.item;
            /*
            const value = item.value;
            const texts = [item.text];
            let parent = downlineItem.parent;
            while (!_.isNil(parent)) {
                texts.push(parent.item.text);
                parent = parent.parent;
            }
            const reverseTexts = _.reverse(texts);
            const row = `${reverseTexts.join(' -> ')} : ${value}`;

            var opt: any = {};
            this.departmentService.getItem(item.value, opt).then(o => {
                this.item.category = o;
            });*/
        });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event, { expand: 'state' });
    }

    onRowSelect(event) {
        this.selectOne(event.data._id, { expand: 'state' });
        setTimeout(function () {
            $(document).ready(function () {
                $('.ui-dropdown-trigger').removeClass('ui-corner-right').addClass('ui-corner-left');
                $('.ui-dropdown-trigger').removeClass('ui-dropdown-trigger').addClass('ui-dropdown-trigger-rtl');
                $('.ui-dropdown-label').removeClass('ui-dropdown-label').addClass('ui-dropdown-label-rtl');
            });
        }, 250);

    }

    onSave() {
        this.save(null, { expand: 'state' });
    }

    onRemove() {
        this.remove(null, { expand: 'state' });
    }

    onNew() {
        this.clear();
        this.item = new Discount();
        var d = new Date();
        const currentInfo = this.authenticationService.getCurrentInfo();
        this.item.owner = currentInfo.account;
        this.item.category = <Department>{};
        this.item.state = <{ _id: String, caption: String }>this._defaultState;
        this.item.beginDate = CalendarConvertor.gregorianToJalali(d.toJSON());
        this.item.expireDate = CalendarConvertor.gregorianToJalali(d.toJSON());
    }
}

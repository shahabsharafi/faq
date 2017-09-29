import { Component, OnInit } from '@angular/core';

import { Discount, Attribute } from '../../models/index';
import { DiscountService, DepartmentService, ResourceService, AttributeService } from '../../services/index';
import { BaseComponent, CrudComponent, ComponentUtility } from '../index';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { CalendarConvertor }  from '../../_infrastructure/index';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
    selector:'discount-list',
    templateUrl: './discount-list.component.html',
})
export class DiscountListComponent extends CrudComponent<Discount> implements OnInit {

    states: SelectItem[];
    _defaultState: any;
    dropdownTreeviewConfig: any;
    categoryItems: TreeviewItem[];

    constructor(
        private discountService: DiscountService,
        private departmentService: DepartmentService,
        protected resourceService: ResourceService,
        protected attributeService: AttributeService)
    {
        super(resourceService, discountService);
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
        /*
        this.departmentService.getList().then(list => {
            var _fn = function(list) {
                var items = new Array<TreeviewItem>();
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var item = new TreeviewItem({
                        text: obj.caption,
                        value: obj._id,
                        children: <TreeviewItem[]> _fn(obj.children)
                    });
                    items.push(item);
                }
                return items;
            }
            this.categoryItems = <TreeviewItem[]> _fn(list);
        });
        */
        this.categoryItems = [new TreeviewItem({
            text: 'Children', value: 1, collapsed: false, children: [
                { text: 'Baby 3-5', value: 11 },
                { text: 'Baby 6-8', value: 12 },
                { text: 'Baby 9-12', value: 13 }
            ]
        })];

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
        this.item.state = <{ _id: String, caption: String }>this._defaultState;
        this.item.beginDate = CalendarConvertor.gregorianToJalali(d.toJSON());
        this.item.expireDate = CalendarConvertor.gregorianToJalali(d.toJSON());
    }
}

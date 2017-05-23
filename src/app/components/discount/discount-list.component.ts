import { Component, OnInit } from '@angular/core';

import { Discount } from '../../models/index';
import { DiscountService, ResourceService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector:'discount-list',
    templateUrl: './discount-list.component.html',
})
export class DiscountListComponent extends CrudComponent<Discount> implements OnInit {

    constructor(
        private discountService: DiscountService,
        protected resourceService: ResourceService)
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
            {field: 'state', header: this.res.discount_state, filter: 'false', sortable: 'true'}
        ];
        this.load(null);
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event);
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
        this.item = <Discount>{};
    }
}

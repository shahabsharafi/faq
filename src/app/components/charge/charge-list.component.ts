import { Component, OnInit, ViewChild } from '@angular/core';

import { Charge } from '../../models/index';
import { ChargeService, ResourceService, AuthenticationService, AccountService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent } from 'primeng/primeng';
import { CalendarConvertor }  from '../../_infrastructure/index';

@Component({
    selector:'charge-list',
    templateUrl: './charge-list.component.html'
})
export class ChargeListComponent extends CrudComponent<Charge> implements OnInit {

    accounts: any[];

    constructor(
        protected authenticationService: AuthenticationService,
        protected resourceService: ResourceService,
        private chargeService: ChargeService,
        protected accountService: AccountService)
    {
        super(resourceService, chargeService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.cols = [
            {field: 'createDate', header: this.res.charge_createDate, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'account.username', header: this.res.charge_account, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'description', header: this.res.charge_description, filter: 'false', sortable: 'true'},
            {field: 'amount', header: this.res.charge_amount, filter: 'false', sortable: 'true'}
        ];
        this.load(null, { expand: 'account' });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event, { expand: 'account' });
    }

    onRowSelect(event) {
        this.selectOne(event.data._id, { expand: 'account' });
    }

    onSelect() {

    }

    onSave() {
        this.save(null, { expand: 'account' });
    }

    onRemove() {
        this.remove(null, { expand: 'from,to,department' });
    }

    onNew() {
        this.clear();
        this.item = <Charge>{};
        var d = new Date();
        this.item.createDate = CalendarConvertor.gregorianToJalali(d.toJSON());
    }

    onSearchAccount(event) {
        this.accountService.search(event.query).then(data => {
            this.accounts = data;
        });
    }
}

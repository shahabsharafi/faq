import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';

import { ResourceService, AccountService } from '../../services/index';
import { BaseComponent } from '../index';
import { ParamMap, ActivatedRoute } from '@angular/router';

@Component({
    selector:'bankport',
    templateUrl: './bankport.component.html',
})
export class BankportComponent extends BaseComponent implements OnInit {

    amount: Number;
    username: string;

    constructor(
        protected resourceService: ResourceService,
        protected accountService: AccountService,
        private route: ActivatedRoute)
    {
        super(resourceService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.username = this.route.snapshot.paramMap.get('id');

    }

    go(event) {

    }
}

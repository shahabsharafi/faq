import { Component, OnInit, ViewChild } from '@angular/core';

import { Message } from '../../models/index';
import { MessageService, ResourceService, AuthenticationService, AccountService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent } from 'primeng/primeng';
import { CalendarConvertor }  from '../../_infrastructure/index';

@Component({
    selector:'message-list',
    templateUrl: './message-list.component.html'
})
export class MessageListComponent extends CrudComponent<Message> implements OnInit {

    accounts: any[];

    constructor(
        protected authenticationService: AuthenticationService,
        protected resourceService: ResourceService,
        private messageService: MessageService,
        protected accountService: AccountService)
    {
        super(resourceService, messageService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.cols = [
            {field: 'owner.username', header: this.res.message_owner, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'title', header: this.res.message_title, filter: 'false', sortable: 'true'},
            {field: 'createDate', header: this.res.message_createDate, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'issueDate', header: this.res.message_issueDate, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'expireDate', header: this.res.message_expireDate, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},

        ];
        this.load(null, { expand: 'owner' });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event, { expand: 'owner' });
    }

    onRowSelect(event) {
        this.selectOne(event.data._id, { expand: 'owner' });
    }

    onSelect() {

    }

    onSave() {
        this.save(null, { expand: 'owner' });
    }

    onRemove() {
        this.remove(null, { expand: 'owner' });
    }

    onNew() {
        this.clear();
        this.item = <Message>{};
        var d = new Date();
        this.item.createDate = CalendarConvertor.gregorianToJalali(d.toJSON());
        this.item.issueDate = CalendarConvertor.gregorianToJalali(d.toJSON());
        this.item.expireDate = CalendarConvertor.gregorianToJalali(d.toJSON());
    }

    onSearchAccount(event) {
        this.accountService.search(event.query).then(data => {
            this.accounts = data;
        });
    }
}

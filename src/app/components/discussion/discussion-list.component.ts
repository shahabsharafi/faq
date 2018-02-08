import { Component, OnInit, ViewChild } from '@angular/core';

import { Discussion } from '../../models/index';
import { DiscussionService, ResourceService, AuthenticationService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector:'discussion-list',
    templateUrl: './discussion-list.component.html'
})
export class DiscussionListComponent extends CrudComponent<Discussion> implements OnInit {

    extraItem: { state: String, cancelation: String };

    constructor(
        protected authenticationService: AuthenticationService,
        protected resourceService: ResourceService,
        private discussionService: DiscussionService)
    {
        super(resourceService, discussionService);
        this.extraItem = <{ state: String, cancelation: String }>{};
    }

    ngOnInit() {
        super.ngOnInit();
        this.cols = [
            {field: 'display', header: this.res.discussion_display, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'from.username', header: this.res.discussion_from, filter: 'true', filterMatchMode: 'contains', sortable: 'true'},
            {field: 'to.username', header: this.res.discussion_to, filter: 'false', sortable: 'true'},
            {field: 'department.caption', header: this.res.discussion_department, filter: 'false', sortable: 'true'}
        ];
        this.load(null, { expand: 'from,to,department' });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event, { expand: 'from,to,department' });
    }

    onRowSelect(event) {
        this.selectOne(event.data._id, { expand: 'from,to,department' });
    }

    onSelect() {
        switch (this.item.cancelation){
            case 1:
                this.extraItem.cancelation =
                    this.resourceService.getValue('discussion_cancelation_unclear');
                break;
            case 2:
                this.extraItem.cancelation =
                    this.resourceService.getValue('discussion_cancelation_unrelated');
                break;
            case 3:
                this.extraItem.cancelation =
                    this.resourceService.getValue('discussion_cancelation_annoying');
                break;
            case 4:
                this.extraItem.cancelation =
                    this.resourceService.getValue('discussion_cancelation_offensiv');
                break;
        }
        switch (this.item.state){
            case 0:
                this.extraItem.state =
                    this.resourceService.getValue('discussion_state_created');
                break;
            case 1:
                this.extraItem.state =
                    this.resourceService.getValue('discussion_state_recived');
                break;
            case 2:
                this.extraItem.state =
                    this.resourceService.getValue('discussion_state_finished');
                break;
            case 3:
                this.extraItem.state =
                    this.resourceService.getValue('discussion_state_report');
                break;
        }
    }

    onSave() {
        this.save(null, { expand: 'from,to,department' });
    }

    onRemove() {
        this.remove(null, { expand: 'from,to,department' });
    }

    onNew() {
        //this.clear();
        //this.item = <Discussion>{};
    }
}

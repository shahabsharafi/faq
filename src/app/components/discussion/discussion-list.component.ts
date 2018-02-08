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

    extraItem: any;

    constructor(
        protected authenticationService: AuthenticationService,
        protected resourceService: ResourceService,
        private discussionService: DiscussionService)
    {
        super(resourceService, discussionService);
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
        switch (item.cancelation){
            case 1:
                extraItem.cancelation =
                    this.resourceService.getValue('cancelation_unclear');
                break;
            case 2:
                extraItem.cancelation =
                    this.resourceService.getValue('cancelation_unrelated');
                break;
            case 3:
                extraItem.cancelation =
                    this.resourceService.getValue('cancelation_annoying');
                break;
            case 4:
                extraItem.cancelation =
                    this.resourceService.getValue('cancelation_offensiv');
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

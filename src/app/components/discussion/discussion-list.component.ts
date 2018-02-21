import { Component, OnInit, ViewChild } from '@angular/core';

import { Discussion } from '../../models/index';
import { DiscussionService, ResourceService, AuthenticationService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';

@Component({
    selector:'discussion-list',
    templateUrl: './discussion-list.component.html'
})
export class DiscussionListComponent extends CrudComponent<Discussion> implements OnInit {

    extraItem: { state: String, cancelation: String };
    search: { state: Number, cancelation: Number };
    states: SelectItem[];
    cancelations: SelectItem[];
    displayState: boolean = false;

    constructor(
        protected authenticationService: AuthenticationService,
        protected resourceService: ResourceService,
        private discussionService: DiscussionService)
    {
        super(resourceService, discussionService);
        this.extraItem = <{ state: String, cancelation: String }>{};
        this.search = <{ state: Number, cancelation: Number }>{};
    }

    ngOnInit() {
        super.ngOnInit();
        this.cols = [
            {field: 'display', header: this.res.discussion_display, filter: 'false', sortable: 'true'},
            {field: 'from.username', header: this.res.discussion_from, filter: 'false', sortable: 'true'},
            {field: 'to.username', header: this.res.discussion_to, filter: 'false', sortable: 'true'},
            {field: 'department.caption', header: this.res.discussion_department, filter: 'false', sortable: 'true'}
        ];

        this.states = [
            { label: "---", value: -1 },
            { label: this.res.discussion_state_created, value: 0 },
            { label: this.res.discussion_state_recived, value: 1 },
            { label: this.res.discussion_state_finished, value: 2 },
            { label: this.res.discussion_state_report, value: 3 }
        ];
        this.cancelations = [
            { label: "---", value: -1 },
            { label: this.res.discussion_cancelation_unclear, value: 1 },
            { label: this.res.discussion_cancelation_unrelated, value: 2 },
            { label: this.res.discussion_cancelation_annoying, value: 3 },
            { label: this.res.discussion_cancelation_offensiv, value: 4 },
        ];
        this.search = { state: -1, cancelation: -1 };

        this.load(null, { expand: 'from,to,department' });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.load(event, { expand: 'from,to,department' });
    }

    onRowSelect(event) {
        this.displayState = false;
        this.selectOne(event.data._id, { expand: 'from,to,department' });
    }

    onSelect() {
        if (this.item.cancelation && this.item.cancelation > 0 && this.item.cancelation < 5) {
            this.extraItem.cancelation = this.cancelations[this.item.cancelation].label;
        } else {
            this.extraItem.cancelation = '';
        }

        if (this.item.state != null && this.item.state > -1 && this.item.state < 4) {
            this.extraItem.state = this.states[this.item.state + 1].label;
        } else {
            this.extraItem.state = '';
        }
    }

    onSearch() {
        var filters = [];
    if (this.search.state != -1) filters["state"] = { matchMode: "equals", value: this.search.state };
    if (this.search.cancelation != -1) filters["cancelation"] = { matchMode: "equals", value: this.search.cancelation };
        this.load(null, { expand: 'from,to,department', filters: filters });
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

    changeState() {
        this.displayState = true;
    }
}

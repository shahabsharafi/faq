import { Component, OnInit } from '@angular/core';

import { Account } from '../../models/index';
import { AccountService, ResourceService, AccessService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { TreeNode } from 'primeng/primeng';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent extends CrudComponent<Account> implements OnInit {

    treeData: TreeNode[];
    
    constructor(
        private accountService: AccountService,
        protected resourceService: ResourceService,
        protected accessService: AccessService)
    {
        super(resourceService, accountService);
    }

    ngOnInit() {
        var me = this;
        this.cols = [
            {field: 'username', header: this.getCaption('account-username')},
            {field: 'profile.firstName', header: this.getCaption('account-firstName')},
            {field: 'profile.lastName', header: this.getCaption('account-lastName')}
        ];
        this.load();
        this.accessService.getList().then(list => {  
        
            var _fn = function(list) {
                var accessList = [];
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var access = <TreeNode>{};
                    access.label = me.getCaption(obj.name);
                    access.data = obj.name;
                    if (obj.children) 
                        access.children = <TreeNode[]> _fn(obj.children);
                    accessList.push(access);
                }
                return accessList;
            }
            this.treeData = <TreeNode[]> _fn(list);
        
        });        
    }

    onRowSelect(event) {
        this.selectOne(event.data._id);
    }

    onSave() {
        //this.save();
    }

    onRemove() {
        this.remove();
    }

    onNew() {
        this.clear();
    }

}

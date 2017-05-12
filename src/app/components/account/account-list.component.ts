import { Component, OnInit } from '@angular/core';

import { Account, Profile, Contact, Education, Extra } from '../../models/index';
import { AccountService, ResourceService, AccessService } from '../../services/index';
import { BaseComponent, CrudComponent } from '../index';
import { TreeNode } from 'primeng/primeng';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent extends CrudComponent<Account> implements OnInit {

    treeData: TreeNode[];
    caption: any;
    
    constructor(
        private accountService: AccountService,
        protected resourceService: ResourceService,
        protected accessService: AccessService)
    {
        super(resourceService, accountService);
        this.item.profile = <Profile>{};
        this.item.contact = <Contact>{};
        this.item.education = <Education>{};
        this.item.extra = <Extra>{};
    }

    ngOnInit() {
        var me = this;
        super.ngOnInit();
        this.cols = [
            {field: 'username', header: this.res.account_username},
            {field: 'profile.firstName', header: this.res.account_firstName},
            {field: 'profile.lastName', header: this.res.account_lastName}
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

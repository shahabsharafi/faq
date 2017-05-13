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

    treeRef: TreeNode[];
    treeData: TreeNode[];
    caption: any;
    selectedItems: TreeNode[];
    
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
        this.item.access = new Array<String>();
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
            var refList = [];
            var _fn = function(list) {
                var accessList = [];
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var access = <TreeNode>{};
                    access.label = me.getCaption(obj.name);
                    access.data = obj.name;
                    if (obj.children) 
                        access.children = <TreeNode[]> _fn(obj.children);
                    refList.push(access);
                    accessList.push(access);
                }
                return accessList;
            }
            this.treeData = <TreeNode[]> _fn(list);
            this.treeRef = <TreeNode[]> refList;
        });        
    }

    onSelect() {
        this.selectedItems = new Array<TreeNode>();
        for (var i = 0; i < this.item.access.length; i++) {
            var accessItem = this.item.access[i];
            for (var j = 0; j < this.treeRef.length; j++) {
                var access = this.treeRef[j];
                if (access.data == accessItem)
                    this.selectedItems.push(access);
            }
        }
    }

    onRowSelect(event) {
        this.selectOne(event.data._id);
    }

    onSave() {
        this.item.access = new Array<String>();
        for (var i = 0; i < this.selectedItems.length; i++) {
            var accessItem = this.selectedItems[i];
            this.item.access.push(accessItem.data);
        }
        this.save();
    }

    onRemove() {
        this.remove();
    }

    onNew() {
        this.clear();
    }

}

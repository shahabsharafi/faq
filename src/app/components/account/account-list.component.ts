import { Component, OnInit } from '@angular/core';

import { Account, Profile, Contact, Education, Extra } from '../../models/index';
import { AccountService, ResourceService, AccessService } from '../../services/index';
import { BaseComponent, CrudComponent, TreeComponent } from '../index';
import { TreeNode } from 'primeng/primeng';

@Component({
    selector:'account-list',
    templateUrl: './account-list.component.html',
})
export class AccountListComponent extends CrudComponent<Account> implements OnInit {

    treeData: TreeNode[];
    caption: any;
    scrollWidth: String;
    
    constructor(
        private accountService: AccountService,
        protected resourceService: ResourceService,
        protected accessService: AccessService)
    {
        super(resourceService, accountService);

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
        this.accessService.getList(null).then(list => {
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

    ngAfterViewInit() {
        var me = this;
        var m = $('.ui-datatable-scrollable-header-box').css('margin-right');
        if (m && m != '0px') {
            me.scrollWidth = m;
            $('.ui-datatable-scrollable-header-box').css({'margin-left': me.scrollWidth, 'margin-right': '0px'});
        }
        $('.ui-datatable-scrollable-body').on( "scroll", function () {
            $('.ui-datatable-scrollable-header-box').css({'margin-left': me.scrollWidth, 'margin-right': '0px'});
        });
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
        this.item = new Account();
    }

}

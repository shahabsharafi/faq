import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tree, TreeNode } from 'primeng/primeng';

@Component({
    selector: 'c-tree',
    template: '<p-tree [value]="_value" selectionMode="checkbox" [(selection)]="selectionRef" (onNodeSelect)="nodeSelect($event)" (onNodeUnselect)="nodeUnselect($event)"></p-tree>',
})
export class TreeComponent {
    _value: TreeNode[];
    selectionRef: TreeNode[];
    treeRef: TreeNode[];

    @Input()
    get value() {
        return this._value;
    }

    @Output() valueChange = new EventEmitter();

    set value(val: TreeNode[]) {
        if (!val)
            return;
        this._value = val;
        var refList = [];
        var _fn = function(list) {
            var accessList = [];
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (obj.children)
                    _fn(obj.children);
                refList.push(obj);
            }
        }
        _fn(val);
        this.treeRef = <TreeNode[]> refList;
        this.valueChange.emit(this._value);
    }

    getSelectionRef() {
        var array = new Array<String>();
        for (var i = 0; i < this.selectionRef.length; i++) {
            var accessItem = this.selectionRef[i];
            array.push(accessItem.data);
        }
        return array;
    }

    @Input()
    get selection() {
        return this.getSelectionRef();
    }

    @Output() selectionChange = new EventEmitter();

    set selection(val: TreeNode[]) {
        if (!val)
            return;
        this.selectionRef = new Array<TreeNode>();
        for (var i = 0; i < val.length; i++) {
            var accessItem = val[i];
            for (var j = 0; j < this.treeRef.length; j++) {
                var access = this.treeRef[j];
                if (access.data == accessItem)
                    this.selectionRef.push(access);
            }
        }
    }

    nodeSelect(e) {
        this.selectionChange.emit(this.getSelectionRef());
    }

    nodeUnselect(e) {
        this.selectionChange.emit(this.getSelectionRef());
    }
}

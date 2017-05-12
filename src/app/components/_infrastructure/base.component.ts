import {Component, OnInit} from "@angular/core";
import { ResourceService } from './../../services/index';

export class BaseComponent {

    res: any;    

    constructor (protected resourceService: ResourceService) { }

    ngOnInit() {
        this.res = this.resourceService.getData();
    }

    getLabel(key: string): string {
        return this.resourceService.getValue(key) + ':';
    }

    getCaption(key: string): string {
        return this.resourceService.getValue(key);
    }
}

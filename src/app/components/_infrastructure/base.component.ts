import {Component, OnInit} from "@angular/core";
import { ResourceService } from './../../services/index';

export class BaseComponent {

    constructor (protected resourceService: ResourceService) { }

    ngOnInit() {

    }

    getCaption(key: string): string {
    return this.resourceService.getValue(key) + ':';
    }

    getHeader(key: string): string {
        return this.resourceService.getValue(key);
    }
}

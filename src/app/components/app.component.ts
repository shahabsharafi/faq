import { Component, OnInit, ViewChild } from "@angular/core";

import { MenuItem } from '../models/index';
import { MenuService, ResourceService, Logger } from '../services/index';

@Component({
    selector:'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    //@ViewChild(SlideMenu) slideMenu: SlideMenu;

    private menuItems: MenuItem[];
    //private sliderItems: MenuItem[];

constructor (
    private menuService: MenuService,
    protected resourceService: ResourceService) { }

    ngOnInit() {
        this.resourceService.load();

        this.menuService.getList(null).then(menuItems => this.menuItems = menuItems);
    }
}

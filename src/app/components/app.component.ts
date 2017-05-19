import { Component, OnInit, ViewChild } from "@angular/core";
import { Response } from '@angular/http';
import { Router, NavigationEnd  } from '@angular/router';

import { MenuItem } from '../models/index';
import { MenuService, ResourceService, Logger } from '../services/index';
import { BaseComponent } from './index';

@Component({
    selector:'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent extends BaseComponent implements OnInit {

    //@ViewChild(SlideMenu) slideMenu: SlideMenu;

    private menuItems: MenuItem[];
    //private sliderItems: MenuItem[];

constructor (
    private menuService: MenuService,
    protected resourceService: ResourceService,
    private router: Router)
{
    super(resourceService);
    var me = this;
    /*
    router.events.subscribe(event => {
        if(event instanceof NavigationEnd) {
            this.menuService.getList(null).then(menuItems =>
                this.menuItems = menuItems.map(function(obj)
                {
                    obj.name = me.res[obj.name];
                    return obj;
                })
            ).catch(this.handleError);
        }
        // NavigationStart
        // NavigationEnd
        // NavigationCancel
        // NavigationError
        // RoutesRecognized
    });
    */
}

    ngOnInit() {
        var me = this;

        this.resourceService.load().then(data => {
            super.ngOnInit();
            this.menuService.getList(null).then(menuItems =>
                this.menuItems = menuItems.map(function(obj)
                {
                    obj.name = me.res[obj.name];
                    return obj;
                })
            );
        });

    }
}

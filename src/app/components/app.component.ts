import { Component, OnInit, ViewChild } from "@angular/core";
import { Response } from '@angular/http';
import { Router, NavigationEnd  } from '@angular/router';

import { MenuItem } from '../models/index';
import { MenuService, ResourceService, AuthenticationService, Logger } from '../services/index';
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
    protected authenticationService: AuthenticationService,
    private menuService: MenuService,
    protected resourceService: ResourceService,
    private router: Router)
{
    super(resourceService);
    var me = this;

    router.events.subscribe(event => {
        if(event instanceof NavigationEnd) {

            this.resourceService.load().then(data => {
                this.res = this.resourceService.getData();
                if (this.authenticationService.isAuthenticated()) {
                    this.menuService.getList().then(menuItems =>
                        this.menuItems = menuItems.map(function(obj)
                        {
                            obj.name = me.res[obj.name];
                            return obj;
                        })
                    ).catch(error => function(err) {
                        this.menuItems = null;
                    });
                } else {
                    this.menuItems = null;
                }
            });
        }
        // NavigationStart
        // NavigationEnd
        // NavigationCancel
        // NavigationError
        // RoutesRecognized
    });

}

    ngOnInit() { }
}

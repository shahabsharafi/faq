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
    private currentInfo: any;
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

            me.resourceService.load().then(data => {
                me.res = me.resourceService.getData();
                if (me.authenticationService.isAuthenticated()) {
                    me.currentInfo = me.authenticationService.getCurrentInfo();
                    me.menuService.getList().then(menuItems =>
                        me.menuItems = menuItems.map(function(obj)
                        {
                            obj.name = me.res[obj.name];
                            if (obj.children) {
                                obj.children.map(function(obj) {
                                    obj.name = me.res[obj.name];
                                    return obj;
                                });
                            }
                            return obj;
                        })
                    ).catch(error => function(err) {
                        me.menuItems = null;
                    });
                } else {
                    me.menuItems = null;
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

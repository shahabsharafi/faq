import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Response } from '@angular/http';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';

import { MenuItem } from '../models/index';
import { MenuService, ResourceService, AuthenticationService, Logger } from '../services/index';
import { BaseComponent } from './index';

@Component({
    selector:'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./styles.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent extends BaseComponent implements OnInit {

    //@ViewChild(SlideMenu) slideMenu: SlideMenu;

    public menuItems: MenuItem[];
    public currentInfo: any;
    //private sliderItems: MenuItem[];
    public inline: boolean;

constructor (
    protected authenticationService: AuthenticationService,
    private menuService: MenuService,
    protected resourceService: ResourceService,
    private route: ActivatedRoute,
    private router: Router)
{
    super(resourceService);
    var me = this;
    me.res = {};

    router.events.subscribe(event => {

        if(event instanceof NavigationEnd) {
            me.res = {};
            me.currentInfo = null;

            this.inline = !(event.url.indexOf('charge/') > 0 || event.url.indexOf('bankport/') > 0)

            if (event.url.indexOf('charge/') > 0) {
                let id = event.url.replace(/\/charge\//g, '');
                me.resourceService.load().then(data => {
                    me.res = me.resourceService.getData();
                    if (me.authenticationService.isAuthenticated()) {
                        me.currentInfo = me.authenticationService.getCurrentInfo();

                        router.navigate(['/bankport', id]);
                    } else {
                        me.menuItems = null;
                    }
                });

            } else {
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
        }
        // NavigationStart
        // NavigationEnd
        // NavigationCancel
        // NavigationError
        // RoutesRecognized
    });

}

    ngOnInit() {

    }
}

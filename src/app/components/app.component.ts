import {Component, OnInit} from "@angular/core";
import {ResourceService} from "./../services/index"

@Component({
    selector:'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    constructor (private resourceService: ResourceService) { }

    ngOnInit() {
        this.resourceService.load();
    }
}

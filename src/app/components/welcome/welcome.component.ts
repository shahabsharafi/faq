import {Component} from "@angular/core";

@Component({
    selector:'welcome',
    templateUrl: './welcome.component.html'
})
export class WelcomeComponent {



    ngAfterViewInit() {
        var me = this;
        $(document).ready(function () {
            var myCarousel: any = $("#myCarousel");
            myCarousel.carousel();
        });
    }
}



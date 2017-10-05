import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RlTagInputModule} from 'angular2-tag-input';
import { DataTableModule, SharedModule, InputTextModule, PasswordModule, AutoCompleteModule, DropdownModule, FileUploadModule, ButtonModule, TreeModule, TabViewModule, DataGridModule, PanelModule, DialogModule, BreadcrumbModule, CarouselModule, CheckboxModule } from 'primeng/primeng';
import { TreeviewModule } from 'ngx-treeview';
import {MomentModule} from 'angular2-moment';
import * as $ from 'jquery';

import { AppComponent, WelcomeComponent, AccountListComponent, DiscussionListComponent, DiscountListComponent, DepartmentTreeComponent, SigninComponent, SignupComponent, TreeComponent, DatepickerComponent } from './components/index';
import { Routing } from './app.routing';
import { AuthGuard, AuthenticationService, AccountService, AccessService, DepartmentService, DiscussionService, DiscountService, AttributeService, MenuService, ResourceService, Logger } from './services/index';

import { enableProdMode } from '@angular/core';
enableProdMode();

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        Routing,
        HttpModule,
        FormsModule,
        RlTagInputModule,
        ReactiveFormsModule,
        SharedModule,
        DataTableModule,
        InputTextModule,
        PasswordModule,
        AutoCompleteModule,
        DropdownModule,
        FileUploadModule,
        ButtonModule,
        TreeModule,
        TabViewModule,
        MomentModule,
        DataGridModule,
        PanelModule,
        DialogModule,
        BreadcrumbModule,
        CarouselModule,
        CheckboxModule,
        TreeviewModule.forRoot()
    ],
    declarations: [
        AppComponent,
        WelcomeComponent,
        AccountListComponent,
        DiscussionListComponent,
        DiscountListComponent,
        DepartmentTreeComponent,
        SigninComponent,
        SignupComponent,
        TreeComponent,
        DatepickerComponent
    ],
    providers: [
        AuthGuard,
        ResourceService,
        Logger,
        AuthenticationService,
        AccountService,
        AccessService,
        DepartmentService,
        DiscussionService,
        DiscountService,
        AttributeService,
        MenuService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, SharedModule, InputTextModule, ButtonModule, TreeModule, TabViewModule } from 'primeng/primeng';
import * as $ from 'jquery';

import { AppComponent, WelcomeComponent, AccountListComponent, RoleListComponent, LoginComponent, TreeComponent } from './components/index';
import { Routing } from './app.routing';
import { AuthGuard, AuthenticationService, AccountService, RoleService, AccessService, AttributeService, MenuService, ResourceService, Logger } from './services/index';

import { enableProdMode } from '@angular/core';
enableProdMode();

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        Routing,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        DataTableModule,
        InputTextModule,
        ButtonModule,
        TreeModule,
        TabViewModule
    ],
    declarations: [
        AppComponent,
        WelcomeComponent,
        AccountListComponent,
        RoleListComponent,
        LoginComponent,
        TreeComponent
    ],
    providers: [
        AuthGuard,
        ResourceService,
        Logger,
        AuthenticationService,
        AccountService,
        RoleService,
        AccessService,
        AttributeService,
        MenuService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}

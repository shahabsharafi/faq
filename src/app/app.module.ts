import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, SharedModule } from 'primeng/primeng';

import { AppComponent, WelcomeComponent, AccountListComponent, RoleListComponent, LoginComponent } from './components/index';
import { Routing } from './app.routing';
import { AuthGuard, AuthenticationService, UserService, RoleService, MenuService, ResourceService, Logger } from './services/index';

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
        DataTableModule
    ],
    declarations: [
        AppComponent,
        WelcomeComponent,
        AccountListComponent,
        RoleListComponent,
        LoginComponent
    ],
    providers: [
        AuthGuard,
        ResourceService,
        Logger,
        AuthenticationService,
        UserService,
        RoleService,
        MenuService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}

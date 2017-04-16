import './polyfills';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {AccountListComponent} from './account-list/account-list.component';
import { routing }        from './app.routing';
import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService } from './_services/index';
import { LoginComponent } from './login/index';

import {enableProdMode} from '@angular/core';
enableProdMode();

@NgModule({
    imports: [
        BrowserModule,
        routing,
        HttpModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        WelcomeComponent,
        AccountListComponent,
        LoginComponent
    ],
    providers: [
        AuthGuard,        
        AuthenticationService,
        UserService
    ],
    //providers: [],
    bootstrap: [AppComponent]
})

export class AppModule {}
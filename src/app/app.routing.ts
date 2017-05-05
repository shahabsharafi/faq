import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/index';
import { WelcomeComponent } from './components/welcome/welcome.component';
import {AccountListComponent} from './components/account-list/account-list.component';
import { AuthGuard } from './guards/index';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '',      component: WelcomeComponent },
    { path: 'account-list', component: AccountListComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);

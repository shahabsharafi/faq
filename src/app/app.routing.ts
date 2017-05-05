import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, WelcomeComponent, AccountListComponent } from './components/index';
import { AuthGuard } from './services/index';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '',      component: WelcomeComponent },
    { path: 'account-list', component: AccountListComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);

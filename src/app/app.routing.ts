import { Routes, RouterModule } from '@angular/router';

import { SigninComponent, SignupComponent, WelcomeComponent, AccountListComponent, DiscountListComponent, DepartmentTreeComponent } from './components/index';
import { AuthGuard } from './services/index';

const appRoutes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', component: WelcomeComponent },
    { path: 'account-list', component: AccountListComponent, canActivate: [AuthGuard] },
    { path: 'discount-list', component: DiscountListComponent, canActivate: [AuthGuard] },
    { path: 'department-tree', component: DepartmentTreeComponent, canActivate: [AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const Routing = RouterModule.forRoot(appRoutes);

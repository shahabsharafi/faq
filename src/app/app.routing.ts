import { Routes, RouterModule } from '@angular/router';

import { SigninComponent, SignupComponent, WelcomeComponent, AccountListComponent, DiscussionListComponent, DiscountListComponent, DepartmentTreeComponent, ChargeListComponent, MessageListComponent } from './components/index';
import { AuthGuard } from './services/index';

const appRoutes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', component: WelcomeComponent },
    { path: 'account-list', component: AccountListComponent, canActivate: [AuthGuard] },
    { path: 'discount-list', component: DiscountListComponent, canActivate: [AuthGuard] },
    { path: 'discussion-list', component: DiscussionListComponent, canActivate: [AuthGuard] },
    { path: 'charge-list', component: ChargeListComponent, canActivate: [AuthGuard] },
    { path: 'message-list', component: MessageListComponent, canActivate: [AuthGuard] },
    { path: 'department-tree', component: DepartmentTreeComponent, canActivate: [AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const Routing = RouterModule.forRoot(appRoutes);

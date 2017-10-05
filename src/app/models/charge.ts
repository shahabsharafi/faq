import { Account } from './account';
export interface Charge {
    _id;
    amount: Number;
    account: Account;
    description: String;
    createDate;
}

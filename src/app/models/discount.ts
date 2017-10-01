import { Department } from './department';
import { Account } from './account';
export class Discount {
    constructor () {
        this.owner = new Account();
        this.category = <Department>{};
        this.state = <{ _id: String, caption: String }>{};
    }
    _id;
    owner: Account;
    category: Department;
    price;
    count;
    cover;
    state: { _id: String, caption: String };
    beginDate;
    expireDate;
}

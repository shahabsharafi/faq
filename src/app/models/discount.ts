import { Department } from './department';
import { Account } from './account';
import { Attribute } from './attribute';
export class Discount {
    constructor () {
        this.owner = new Account();
        this.category = <Department>{};
        this.state = <Attribute>{};
    }
    _id;
    owner: Account;
    category: Department;
    price;
    count;
    total;
    used;
    state: Attribute;
    beginDate;
    expireDate;
}

import { Department } from './department';
import { Account } from './account';
import { Attribute } from './attribute';
export class Discount {
    constructor () {
        this.owner = new Account();
        this.category = <Department>{};
        this.type = <Attribute>{};
    }
    _id;
    owner: Account;
    category: Department;
    price;
    count;
    total;
    used;
    type: Attribute;
    isOrganization;
    orgCode;
    beginDate;
    expireDate;
}

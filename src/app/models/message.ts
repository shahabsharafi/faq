import { Account } from './account';
export class Message {
    constructor () {
        this.owner = new Account();
    }
    _id;
    title;
    text;
    owner: Account;
    createDate;
    issueDate;
    expireDate;
}

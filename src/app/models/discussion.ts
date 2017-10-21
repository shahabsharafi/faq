import { Department } from './department';
import { Account } from './account';
export interface DiscussionDetail {
    owner: Account;
    createDate: Date;
    text: String;
    attachment: String;
}
export interface Discussion {
    _id;
    title: String;
    display: String;
    from: Account;
    to: Account;
    state;//0: created, 1: recived, 2:finished, 3: report
    cancelation;//1: CANCELATION_UNCLEAR, 2:CANCELATION_UNRELATED, 3:CANCELATION_ANNOYING, 4:CANCELATION_OFFENSIV
    price: Number;
    payment: Number;
    wage: Number;
    discount: Number;
    operatorRead: Boolean;
    userRead: Boolean;
    department: Department;
    createDate: Date;
    answerDate: Date;
    expDate: Date;
    items: [DiscussionDetail];
    tags: [String];
}

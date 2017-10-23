import { Account } from './account';
export interface Answer {
    text: String;
    value: String;
}
export interface Question {
    no: Number;
    title: String;
    condition: <{ no: Number, value: String }>{};
    answers: Answer[];
}
export interface Result {
    no: Number;
    answer: String;
}
export interface Poll {
    _id: String;
    account: Account;
    name: String;
    type: Number;
    questions: Question[];
    results: Result[];
}


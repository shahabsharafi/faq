import { Attribute } from './attribute';
export interface Profile {
    firstName: String;
    lastName: String;
    fatherName: String;
    birthDay: String;
    no: String;
    placeOfIssues: String;
    nationalCode: String;
    birthPlace: String;
    sex: Number;
    status: Number
}
export interface Contact {
    house: String;
    work: String;
    province: { _id: String, caption: String };
    city: { _id: String, caption: String };
    address: String;
    pcode: String
}
export interface Education {
    grade: { _id: String, caption: String };
    major: { _id: String, caption: String };
    university: { _id: String, caption: String };
    level: { _id: String, caption: String };
}
export interface Extra {
    language: Attribute[];
    dialect: Attribute[];
}
export class Account {
    constructor () {
        this.profile = <Profile>{};
        this.contact = <Contact>{};
        this.education = <Education>{};
        this.extra = <Extra>{};
        this.access = new Array<String>();
    }
    _id;
    username: String;
    access: Array<String>;
    email: String;
    mobile: String;
    profile: Profile;
    contact: Contact;
    education: Education;
    extra: Extra;
}

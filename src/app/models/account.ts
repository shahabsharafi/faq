import { Attribute } from './attribute';
export class Profile {
    constructor () {
        this.sex = <{ _id: String, caption: String }>{};
        this.status = <{ _id: String, caption: String }>{};
        this.jobState = <{ _id: String, caption: String }>{};
        this.religion = <{ _id: String, caption: String }>{};
        this.sect = <{ _id: String, caption: String }>{};
        this.reference = <{ _id: String, caption: String }>{}
    }
    firstName: String;
    lastName: String;
    fatherName: String;
    birthDay: String;
    no: String;
    placeOfIssues: String;
    nationalCode: String;
    birthPlace: String;
    sex: { _id: String, caption: String };
    status: { _id: String, caption: String };
    jobState: { _id: String, caption: String };
    religion: { _id: String, caption: String };
    sect: { _id: String, caption: String };
    reference: { _id: String, caption: String };
}
export interface Contact {
    house: String;
    work: String;
    country: { _id: String, caption: String };
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
        this.profile = new Profile();
        this.contact = <Contact>{};
        this.education = <Education>{};
        this.extra = <Extra>{};
    }
    _id;
    username: String;
    email: String;
    mobile: String;
    profile: Profile;
    contact: Contact;
    education: Education;
    extra: Extra;
    isOperator: Boolean;
    isUser: Boolean;
    isManager: Boolean;
    price: Number;
}

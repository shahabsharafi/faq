export interface Profile {
    firstName: String;
    lastName: String;
    fatherName: String;
    birthDay: Date;
    no: String;
    placeOfIssues: String;
    nationalCode: String;
    birthPlace: String;
    sex: Number;
    status: Number
}
export interface Contact {
    mobile: String;
    house: String;
    work: String;
    email: String;
    contry: String;
    city: String;
    address: String;
    pcode: String
}
export interface Education {
    grade: String;
    major: String;
    university: String;
    level: String
}
export interface Extra {
    language: String;
    dialect: String
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
    sms: String;
    profile: Profile;
    contact: Contact;
    education: Education;
    extra: Extra;
}
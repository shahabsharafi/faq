export interface Department {
    _id;
    type: String;
    caption: String;
    parentId: String;
    description: String;
    language: { _id: String, caption: String };
    selectable: boolean;
    price: number;
    operatorRule: String;
    userRule: String;
    children: Department[];
    accounts: Account[];
}

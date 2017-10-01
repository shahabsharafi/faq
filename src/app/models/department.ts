import { Role } from './role';
export interface Department {
    _id;
    type: String;
    caption: String;
    parentId: String;
    description: String;
    language: { _id: String, caption: String };
    selectable: boolean;
    price: number;
    children: Department[];
    accounts: Account[];
}

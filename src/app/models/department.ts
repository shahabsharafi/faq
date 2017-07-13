import { Role } from './role';
export interface Tag {
    caption: String;
}
export interface Department {
    _id;
    type: String;
    caption: String;
    parentId: String;
    description: String;
    language: { _id: String, caption: String };
    tags: Tag[];
    roles: Role[];
}

export interface Department {
    _id;
    type: String,
    caption: String,
    parentId: String,
    language: { _id: String, caption: String },
}

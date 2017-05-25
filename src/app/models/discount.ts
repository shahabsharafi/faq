export interface Discount {
    _id;
    owner;
    category;
    price;
    count;
    cover;
    state: { _id: String, caption: String };
    beginDate;
    expireDate;
}

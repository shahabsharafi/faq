export class Discount {
    constructor () {
        this.state = <{ _id: String, caption: String }>{}
    }
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

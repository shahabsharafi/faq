import { Attribute } from '../../models/index';

export class ComponentUtility {
    static getDropdownData(list: Attribute[]): any[] {
        var dataList: any[] = [];
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var data: any = {
                label: item.caption,
                value: item._id
            };
            dataList.push(data);
        }
        return dataList;
    }
}

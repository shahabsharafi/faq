import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Message } from '../models/index';
import { AuthenticationService, CrudService } from './index';
import { CalendarConvertor } from '../_infrastructure/index';

@Injectable()
export class MessageService extends CrudService<Message> {
    constructor(
        protected authenticationService: AuthenticationService,
        protected http: Http)
    {
        super(authenticationService, http, '/api/messages');
    }

    copy(src): Message {
        var dst = <Message>{};
        Object.assign(dst, src);
        dst.createDate = CalendarConvertor.gregorianToJalali(src.createDate);
        dst.issueDate = CalendarConvertor.gregorianToJalali(src.issueDate);
        dst.expireDate = CalendarConvertor.gregorianToJalali(src.expireDate);
        return dst;
    }

    beforSave(obj: Message): void {
        obj.createDate = CalendarConvertor.jalaliToGregorian(obj.createDate);
        obj.issueDate = CalendarConvertor.jalaliToGregorian(obj.issueDate);
        obj.expireDate = CalendarConvertor.jalaliToGregorian(obj.expireDate);
    }

    afterLoad(list: Message[]): void {
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                obj.createDate = CalendarConvertor.gregorianToJalali(obj.createDate);
                obj.issueDate = CalendarConvertor.gregorianToJalali(obj.issueDate);
                obj.expireDate = CalendarConvertor.gregorianToJalali(obj.expireDate);
            }
        }
    }

    getKey(obj: Message): any {
        return obj._id;
    }
}

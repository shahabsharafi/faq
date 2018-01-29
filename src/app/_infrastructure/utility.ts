export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

declare var JalaliDate: any;

export class CalendarConvertor {

    static gregorianToJalali(d: String): String {
        if (d) {
            var a1 = d.split('T');
            if (a1.length == 2) {
                var a2 = a1[0].split('-');
                if (a2.length == 3) {
                    var a3 = JalaliDate.gregorianToJalali(a2[0], a2[1], a2[2]);
                    return a3[0] + '-' + a3[1] + '-' + a3[2];
                }
            }
        }
        return '';
    }

    static jalaliToGregorian(d: String): String {
        if (d) {
            var a1 = d.split('-');
            if (a1.length == 3) {
                var a2 = JalaliDate.jalaliToGregorian(a1[0], a1[1], a1[2]);
                    return a2[0] + '-' + a2[1] + '-' + a2[2] + ' 00:00:00.000z';
            }
        }
        return '';
    }
}



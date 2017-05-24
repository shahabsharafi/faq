import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Guid } from '../../_infrastructure/index'

declare var Calendar: any;

@Component({
    selector: 'c-datepicker',
    template: '<div class="datepicker"><input pInputText [id]="_id" [(value)]="value" type="text" (change)="onChange($event)" /> <span [id]="_btnId" class="fa fa-calendar"></span></div>',
    styles: [`
            .datepicker {
                position: relative;
            }

            .datepicker span {
                position: absolute;
                left: 5px;
                top: 5px;
            }
      `]
})
export class DatepickerComponent {
    _value: String;
    _id: String;
    _btnId: String;

    constructor() {
        this._id = Guid.newGuid();
        this._btnId = Guid.newGuid();
    }

    @Input()
    get value() {
        return this._value;
    }

    @Output() valueChange = new EventEmitter();

    set value(val: String) {
        if (!val)
            return;
        this._value = val;
        //write code hear
        this.valueChange.emit(this._value);
    }

    onChange(e) {
        this.value = e.target.value;
    }

    ngAfterViewInit() {
        var me = this;
        $(document).ready(function () {
            var popupCal = Calendar.setup({
                inputField: me._id,   // id of the input field
                button: me._btnId,   // trigger for the calendar (button ID)
                ifFormat: "%Y-%m-%d",       // format of the input field
                dateType: "jalali",
                weekNumbers: false,
                onUpdate: function (cal) {
                    var d = cal.date.print(cal.dateFormat, cal.dateType, cal.langNumbers);
                    me.value = d;
                }
            });
        });
    }
}

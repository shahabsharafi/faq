import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Guid } from '../../_infrastructure/index'

declare var Calendar: any;

@Component({
    selector: 'c-datepicker',
    template: '<input pInputText [id]="_id" [(value)]="_value" type="text" /> <span [id]="_btnId" class="fa fa-calendar"></span>'
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

    ngAfterViewInit() {
        var me = this;
        $(document).ready(function () {
            var popupCal = Calendar.setup({
                inputField: me._id,   // id of the input field
                button: me._btnId,   // trigger for the calendar (button ID)
                ifFormat: "%Y-%m-%d",       // format of the input field
                dateType: "jalali",
                weekNumbers: false
            });
        });
    }
}

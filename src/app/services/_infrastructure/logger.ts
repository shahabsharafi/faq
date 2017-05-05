import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

    constructor() { }

    log(logMsg:string): void {
        console.log(logMsg);
    }
}

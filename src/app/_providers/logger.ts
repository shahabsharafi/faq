import {Injectable, provide} from 'angular2/core';

// do whatever you want for logging here, add methods for log levels etc.
@Injectable()
export class Logger {

  public log(logMsg:string) {
    console.log(logMsg);
  }
}

export var LOGGING_PROVIDERS:Provider[] = [
      provide(Logger, {useClass: Logger}),
];

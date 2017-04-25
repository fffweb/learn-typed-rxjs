"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs/Rx");
/*
https://github.com/ReactiveX/RxJS/blob/master/MIGRATION.md
*/
var observable = Rx.Observable.create(function (observer) {
    observer.next('Simon');
    observer.next('Jen');
    observer.next('Sergi');
    observer.complete(); // We are done
});
observable.subscribe(function next(x) { console.log('Next: ' + x); }, function error(err) { console.log('Error: ' + err); }, function complete() { console.log('Completed'); });

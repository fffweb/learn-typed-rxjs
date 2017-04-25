"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rxjs/Rx");
var simpleStream = Rx.Observable.of('hello world');
simpleStream.subscribe(function (value) {
    console.log(value);
});

"use strict";
var Rx = require("rxjs/Rx");
var simpleStream = Rx.Observable.of('hello world');
simpleStream.subscribe(function (value) {
    console.log(value);
});
// implement .map with .mergeMap
Rx.Observable.prototype.mapWithMergeMap = function (mapFn) {
    return this.mergeMap(function (x) { return Rx.Observable.of(mapFn(x)); });
};
Rx.Observable.range(1, 3)
    .mapWithMergeMap(function (x) { return x * x; })
    .subscribe(function (x) { return console.log('mapWithMergeMap', x); });
// implement .filter with .mergeMap
Rx.Observable.prototype.filterWithMergeMap = function (filterFn) {
    return this.mergeMap(function (x) {
        return filterFn(x) ?
            Rx.Observable.of(x) :
            Rx.Observable.empty();
    }); // return no element
};
Rx.Observable.range(1, 3)
    .filterWithMergeMap(function (x) { return x === 3; })
    .subscribe(function (x) { return console.log('filterWithMergeMap', x); });
// implement .delay with .mergeMap 
Rx.Observable.prototype.delayWithMergeMap = function (delayMs) {
    return this.mergeMap(function (x) {
        return Rx.Observable.create(function (obs) {
            // setTimeout is naive - one should use scheduler instead
            var token = setTimeout(function () {
                obs.next(x);
                obs.complete();
            }, delayMs);
            return function () { return clearTimeout(token); };
        });
    });
};
Rx.Observable.range(1, 3)
    .delayWithMergeMap(500)
    .take(2)
    .subscribe(function (x) { return console.log('delayWithMergeMap', x); });
// recursive count
var count = function (from, to, interval) {
    if (from > to)
        return Rx.Observable.empty();
    return Rx.Observable.timer(interval)
        .mergeMap(function () {
        return count(from + 1, to, interval)
            .startWith(from);
    });
};
count(1, 3, 1000).subscribe(function (x) { return console.log('count', x); });
// just an example of bit different implementation with no returns
var countMoreRxWay = function (time, to, interval) {
    return Rx.Observable.if(function () { return from > to; }, Rx.Observable.empty(), Rx.Observable.timer(interval)
        .mergeMap(function () { return count(from + 1, to, interval)
        .startWith(from); }));
};
var maxConcurrencyExample = function () {
    return Rx.Observable.range(1, 7)
        .do(function (x) { return console.log('emitted', x); })
        .mergeMap(function (x) { return Rx.Observable.timer(1000).mapTo(x); }, 2)
        .do(function (x) { return console.log('processed', x); })
        .subscribe();
};
setTimeout(maxConcurrencyExample, 3100);

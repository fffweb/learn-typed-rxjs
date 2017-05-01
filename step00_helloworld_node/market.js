"use strict";
var Rx = require("rxjs/Rx");

function get(url) {
    return Rx_1.Observable.create(function(observer) {
        // Make a traditional Ajax request
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function() {
            if (req.status == 200) {
                // If the status is 200, meaning there have been no problems,
                // Yield the result to listeners and complete the sequence
                observer.next(req.response);
                observer.complete();
            } else {
                // Otherwise, signal to listeners that there has been an error
                observer.error(new Error(req.statusText));
            }
        };
        req.onerror = function() {
            observer.error(new Error("Unknown Error"));
        };
        req.send();
    });
}

Rx.Observable.interval(1000).subscribe(x => console.log('timer', x))

// implement .map with .mergeMap
Rx.Observable.prototype.mapWithMergeMap = function(mapFn) {
    return this.mergeMap(x => Rx.Observable.of(mapFn(x)));
}

Rx.Observable.range(1, 3)
    .mapWithMergeMap(x => x * x)
    .subscribe(x => console.log('mapWithMergeMap', x))

Rx.Observable.range(1, 3)
    .map(x => x * x)
    .subscribe(x => console.log('map', x));

Rx.Observable.range(1, 3)
    .do(x => console.log("range", x))
    .mergeMap(x => Rx.Observable.range(1, x))
    .subscribe(x => console.log('mergemap', x));


// implement .filter with .mergeMap
Rx.Observable.prototype.filterWithMergeMap = function(filterFn) {
    return this.mergeMap(x =>
        filterFn(x) ?
        Rx.Observable.of(x) :
        Rx.Observable.empty()); // return no element
}

Rx.Observable.range(1, 3)
    .filterWithMergeMap(x => x === 3)
    .subscribe(x => console.log('filterWithMergeMap', x))

// implement .delay with .mergeMap 
Rx.Observable.prototype.delayWithMergeMap = function(delayMs) {
    return this.mergeMap(x =>
        Rx.Observable.create(obs => {
            // setTimeout is naive - one should use scheduler instead
            const token = setTimeout(() => {
                obs.next(x);
                obs.complete();
            }, delayMs)
            return () => clearTimeout(token);
        }))
}

Rx.Observable.range(1, 3)
    .delayWithMergeMap(500)
    .take(2)
    .subscribe(x => console.log('delayWithMergeMap', x))

// recursive count
const count = (from, to, interval) => {
    if (from > to) return Rx.Observable.empty();
    return Rx.Observable.timer(interval)
        .mergeMap(() =>
            count(from + 1, to, interval)
            .startWith(from))
}

count(1, 3, 1000).subscribe(x => console.log('count', x))

// just an example of bit different implementation with no returns
const countMoreRxWay = (from, to, interval) =>
    Rx.Observable.if(
        () => from > to,
        Rx.Observable.empty(),
        Rx.Observable.timer(interval)
        .mergeMap(() => count(from + 1, to, interval)
            .startWith(from)))

const maxConcurrencyExample = () =>
    Rx.Observable.range(1, 7)
    .do(x => console.log('emitted', x))
    .mergeMap(x => Rx.Observable.timer(1000).mapTo(x), 2)
    .do(x => console.log('processed', x))
    .subscribe()

setTimeout(maxConcurrencyExample, 3100)
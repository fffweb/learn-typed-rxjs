"use strict";
var Rx = require("rxjs/Rx");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


function get(url) {
    return Rx.Observable.create(function(observer) {
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

Rx.Observable.interval(1000)
    .mergeMap(x => { return get('/app/contents.json'); })
    .subscribe(function next(x) { console.log('Result: ' + x); }, function error(err) { console.log('Error: ' + err); }, function complete() { console.log('Completed'); })
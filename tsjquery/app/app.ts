import { Observable, Observer,Subject } from 'rxjs/Rx';
import * as $ from 'jquery';
var url_sina = "http://hq.sinajs.cn/?list=BU1709,RU1709,I1709";
declare var IO: any;
var g = new IO.Script();

$(document).ready(() => {
    // console.log("hi");
    // alert("hi");
    // var g = new IO.Script();
    // g.load(url_sina, (b) => {
    //                 console.debug(window["hq_str_BU1709"]);
    // getByRequest(url_zhuli);

    // Create an Ajax Observable
 var test = get(url_zhuli);
 test.subscribe(
     function next(x) { console.log('Result: ' + x); },
     function error(err) { console.log('Error: ' + err); },
     function complete() { console.log('Completed'); }
 );
    Observable.interval(5000).mergeMap(x => {
        return getSina(url_sina)
    }).subscribe(
        function next(x) { 
            // console.log('Result: ' + x); 
        },
        function error(err) { console.log('Error: ' + err); },
        function complete() { console.log('Completed'); }
        );

    // jsonp(url_sina, function (data) {
    //     alert(data);
    // });
})

function getSina(url) {
    return Observable.create(function (observer: Observer<String>) {
        // Make a traditional Ajax request
        g.load(url_sina, (b) => {
            // console.debug(window["hq_str_BU1709"]);
            observer.next(window["hq_str_BU1709"]);
            BU_Stream$.next(window["hq_str_BU1709"]);
            observer.complete();
        });
    });

}

const BU_Stream$ =  new Subject<string>();
BU_Stream$.distinctUntilChanged().subscribe((value) => {
    console.log(new Date());
    console.log("Bu_Stream:"+value);
});

function get(url) {
    return Observable.create(function (observer: Observer<String>) {
        // Make a traditional Ajax request
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                // If the status is 200, meaning there have been no problems,
                // Yield the result to listeners and complete the sequence
                observer.next(req.response);
                observer.complete();
            }
            else {
                // Otherwise, signal to listeners that there has been an error
                observer.error(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            observer.error(new Error("Unknown Error"));
        };
        req.send();
    });
}
// Create an Ajax Observable
// var test = get(url);
// test.subscribe(
//     function next(x) { console.log('Result: ' + x); },
//     function error(err) { console.log('Error: ' + err); },
//     function complete() { console.log('Completed'); }
// );

// Observable.interval(1000).mergeMap(x => {
//     return get(url_sina)
// }).subscribe(
//     function next(x) { console.log('Result: ' + x); },
//     function error(err) { console.log('Error: ' + err); },
//     function complete() { console.log('Completed'); }
//     );

function jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function (data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
    // console
}


var url_zhuli = "http://wmleo.cc/FutureTradeInfoCal/FutureTradeInfoCals?$top=50&$select=Symbol,DateTrade &$filter=DominantNum eq 1 &$orderby=DateTrade desc"
function getByRequest(url) {
    return Observable.create(function (observer: Observer<String>) {
        // Make a traditional Ajax request
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                // If the status is 200, meaning there have been no problems,
                // Yield the result to listeners and complete the sequence
                observer.next(req.response);
                observer.complete();
            }
            else {
                // Otherwise, signal to listeners that there has been an error
                observer.error(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            observer.error(new Error("Unknown Error"));
        };
        req.send();
    });
}

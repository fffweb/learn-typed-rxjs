import {Observable, Observer, Subject} from 'rxjs/Rx';
import * as $ from 'jquery';
// var url_sina = "http://hq.sinajs.cn/?list=BU1709,RU1709,I1709";
var url_sina = "http://hq.sinajs.cn/?list=";
declare var IO : any;
var g = new IO.Script();
let zhulis : string[] = new Array();
// let observer_zhulis: Observer<> =
let DayLastTrade : string;
var hangqingall = new Array < string > ();

$(document).ready(() => {
    // console.log("hi"); alert("hi"); var g = new IO.Script(); g.load(url_sina, (b)
    // => {                 console.debug(window["hq_str_BU1709"]);
    // getByRequest(url_zhuli); Create an Ajax Observable
    var test = get(url_zhuli);
    test.subscribe(function next(responseText) {
        var odatavalue = eval('(' + responseText + ')');
        var values = odatavalue.value; //JSON.parse(result).value;

        var strZhuli = "";
        DayLastTrade = values[0].DateTrade;
        for (var i = 0; i < values.length; i++) {
            //String.trim() cannot use in gadget
            var sym = trim11(values[i].Symbol);
            var s = sym.substr(0, 2);

            if (values[i].DateTrade == DayLastTrade) {

                if (s == "RS" || s == "SM" || s == "FU" || s == "PM" || s == "RI" || s == "TC" || s == "WR" || s == "FB" || s == "WR" || s == "BB" || s == "B1" || s == "LR" || s == "WH" || s == "CF" || s == "JR" || s == "SF") {} else {
                    strZhuli = strZhuli + sym + ": [\"" + sym + "\", [0, \"美元/吨\"]],"
                }
            }
            zhulis.push(sym);
            hangqingall[sym] = "";
        }
        console.log('Result: ' + responseText);
        Observable
            .interval(5000)
            .mergeMap(x => {
                return getSina(url_sina + zhulis.join(","))
            })
            .scan((acc : Array < string >, val : Array < string >) => {
                // let difference = arr1.filter(x => arr2.indexOf(x) == -1);
                var difference={};
                for (var zl in val) {
                    if (val[zl] != acc[zl]) {
                        difference[zl] = val[zl];
                    }
                    // alert(x + "-" + testObj[x]);
                }
                // let difference = val.filter(x => acc.indexOf(x) == -1);
                return difference;
            },new Array<string>())
            .subscribe(function next(x) {
                console.log('Result: ' + x);
            }, function error(err) {
                console.log('Error: ' + err);
            }, function complete() {
                console.log('Completed');
            });
    }, function error(err) {
        console.log('Error: ' + err);
    }, function complete() {
        console.log('Completed');
    });

    // jsonp(url_sina, function (data) {     alert(data); });
})

function getSina(url) {
    return Observable.create(function (observer : Observer < Array < String >>) {
        // Make a traditional Ajax request
        g.load(url, (b) => {
            // console.debug(window["hq_str_BU1709"]);
            let s : string;
            let hangqing = new Array();
            zhulis.forEach(zhuli => {
                hangqing[zhuli] = window["hq_str_" + zhuli];
            });
            // observer.next(window["hq_str_BU1709"]);
            observer.next(hangqing);
            BU_Stream$.next(window["hq_str_BU1709"]);
            observer.complete();
        });
    });

}

const BU_Stream$ = new Subject < string > ();
BU_Stream$
    .distinctUntilChanged()
    .subscribe((value) => {
        console.log(new Date());
        console.log("Bu_Stream:" + value);
    });

function get(url) {
    return Observable.create(function (observer : Observer < String >) {
        // Make a traditional Ajax request
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                // If the status is 200, meaning there have been no problems, Yield the result
                // to listeners and complete the sequence
                observer.next(req.response);
                observer.complete();
            } else {
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
// Create an Ajax Observable var test = get(url); test.subscribe(     function
// next(x) { console.log('Result: ' + x); },     function error(err) {
// console.log('Error: ' + err); },     function complete() {
// console.log('Completed'); } ); Observable.interval(1000).mergeMap(x => {
// return get(url_sina) }).subscribe(     function next(x) {
// console.log('Result: ' + x); },     function error(err) { console.log('Error:
// ' + err); },     function complete() { console.log('Completed'); }     );

function jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function (data) {
        delete window[callbackName];
        document
            .body
            .removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0
        ? '&'
        : '?') + 'callback=' + callbackName;
    document
        .body
        .appendChild(script);
    // console
}

var url_zhuli = "http://wmleo.cc/FutureTradeInfoCal/FutureTradeInfoCals?$top=50&$select=Symbol,Da" +
        "teTrade &$filter=DominantNum eq 1 &$orderby=DateTrade desc"
function getByRequest(url) {
    return Observable.create(function (observer : Observer < String >) {
        // Make a traditional Ajax request
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                // If the status is 200, meaning there have been no problems, Yield the result
                // to listeners and complete the sequence
                observer.next(req.response);
                observer.complete();
            } else {
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

function trim11(str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}
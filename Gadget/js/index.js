var url = "http://hq.sinajs.cn/?list=BU1709,RU1709,I1709";
$(document).ready(function() {
    // $("button").click(ajaxJson);
    // getSinaObservable(url).subscribe()
    // ajaxJson();
    // ajax_test();
    // var subscription = getSinaObservable(url).subscribe(observer);
    Rx.Observable.from([1, 2, 3, 4])
        .map(i => getFreshApiData())
        .subscribe(val => console.log('regular map result: ' + val));

    //vs

    Rx.Observable.from([1, 2, 3, 4])
        .mergeMap(i => getFreshApiData())
        .subscribe(val => console.log('mergeMap result: ' + val));

    function getFreshApiData() {
        return Rx.Observable.of('retrieved new data')
            .delay(1000);
    }

    Rx.Observable.interval(2500).mergeMap(x => {
            return rx.Observable.interval(1000)
        })
        .subscribe(function next(x) { console.log('Result: ' + x); }, function error(err) { console.log('Error: ' + err); }, function complete() { console.log('Completed'); })
        // var jqxhr = $.get(url)
        //     .done(function(data) {

    //         alert("second success");

    //     })
    //     .fail(function() {

    //         alert("error");

    //     })
    //     .always(function() {

    //         alert("finished");

    //     });




});

function getSinaObservable(url) {
    return Rx.Observable.create(function(observer) {
        var subscribed = true;
        $.get(url)
            .done(function(data) {
                // If client is still interested in the results, send them.
                if (subscribed) {
                    // Send data to the client
                    observer.next(data);
                    // Immediately complete the sequence
                    observer.complete();
                }
                // alert("second success");

            })
            .fail(function() {
                if (subscribed) {
                    // Inform the client that an error occurred.
                    observer.error(ex);
                }
                // alert("error");

            })
            // $.get(url, {
            //     success: function(data) {
            //         // If client is still interested in the results, send them.
            //         if (subscribed) {
            //             // Send data to the client
            //             observer.next(data);
            //             // Immediately complete the sequence
            //             observer.complete();
            //         }
            //     },
            //     error: function(ex) {
            //         // If client is still interested in the results, send them.
            //         if (subscribed) {
            //             // Inform the client that an error occurred.
            //             observer.error(ex);
            //         }
            //     }
            // });

        // Definition of the Subscription objects unsubscribe (dispose in RxJS 4) method.
        return function() {
            subscribed = false;
        }
    });
};

var observer = {
    // onNext in RxJS 4
    next: function(data) {
        alert(JSON.stringify(data));
    },
    // onError in RxJS 4
    error: function(err) {
        alert(err);
    },
    // onComplete in RxJS 4
    complete: function() {
        alert("The asynchronous operation has completed.");
    }
};

// var subscription =
//     getSinaObservable(url).subscribe(observer);
// $(document).ready(function() {
//     $("button").click(ajaxJson);
// });

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

// $(document).ready(function() {



//     // Your code here.

//     ajaxJson();

// });

function ajax_test() {

    $.get(url, function(data) {
        alert(data);
    });
}

function ajaxJson() {
    $.getJSON(
        "http://api-global.netflix.com/queue", {
            success: function(json) {
                alert("Data has arrived.");
            },
            error: function(ex) {
                alert("There was an error.")
            }
        });
}

function test1(window, $, showMovieLists, showError) {
    var error,
        configDone,
        movieLists,
        queueList,
        windowLoaded,
        outputDisplayed,
        errorHandler = function() {
            // Otherwise show the error.
            error = "There was a connectivity error";

            // We may be ready to display out
            tryToDisplayOutput();
        },
        tryToDisplayOutput = function() {
            if (outputDisplayed) {
                return;
            }
            if (windowLoaded) {
                if (configDone && movieLists !== undefined) {
                    if (queueList !== undefined) {
                        movieLists.push(queueList);
                    }
                    outputDisplayed = true;
                    showMovieLists(JSON.stringify(movieLists));
                } else if (error) {
                    outputDisplayed = true;
                    showError(error);
                }
            }
        },
        windowLoadHandler = function() {
            windowLoaded = true;

            // Remember to unsubscribe from events
            window.removeEventListener("load", windowLoadHandler);

            // This may be the last task we're waiting on, so try and display output.
            tryToDisplayOutput();
        };

    // Register for the load event
    window.addEventListener("load", windowLoadHandler);

    // Request the service url prefix for the users AB test
    $.getJSON(
        "http://api-global.netflix.com/abTestInformation", {
            success: function(abTestInformation) {
                // Request the member's config information to determine whether their instant
                // queue should be displayed.
                $.getJSON(
                    "http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config", {
                        success: function(config) {
                            // Parallel retrieval of movie list could've failed,
                            // in which case we don't want to issue this call.
                            if (!error) {
                                // If we're supposed to
                                if (config.showInstantQueue) {
                                    $.getJSON(
                                        "http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue", {
                                            success: function(queueMessage) {
                                                queueList = queueMessage.list;

                                                configDone = true;
                                                tryToDisplayOutput();
                                            },
                                            error: errorHandler
                                        });
                                } else {
                                    configDone = true;
                                    tryToDisplayOutput();
                                }
                            }
                        },
                        error: errorHandler
                    });

                // Retrieve the movie list
                $.getJSON(
                    "http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists", {
                        success: function(movieListMessage) {
                            movieLists = movieListMessage.list;
                            tryToDisplayOutput();
                        },
                        error: errorHandler
                    });
            },
            error: errorHandler
        });
}


function ajaxRX(window, $) {
    var getJSON = function(url) {
        return Observable.create(function(observer) {
            var subscribed = true;

            $.getJSON(url, {
                success: function(data) {
                    // If client is still interested in the results, send them.
                    if (subscribed) {
                        // Send data to the client
                        observer.next(data);
                        // Immediately complete the sequence
                        observer.complete();
                    }
                },
                error: function(ex) {
                    // If client is still interested in the results, send them.
                    if (subscribed) {
                        // Inform the client that an error occurred.
                        observer.error(ex);
                    }
                }
            });

            // Definition of the Subscription objects unsubscribe (dispose in RxJS 4) method.
            return function() {
                subscribed = false;
            }
        });
    };

    var observer = {
        // onNext in RxJS 4
        next: function(data) {
            alert(JSON.stringify(data));
        },
        // onError in RxJS 4
        error: function(err) {
            alert(err);
        },
        // onComplete in RxJS 4
        complete: function() {
            alert("The asynchronous operation has completed.");
        }
    };

    var subscription =
        getJSON("http://api-global.netflix.com/abTestInformation").subscribe(observer);

    // setTimeout(function () {
    // 	alert("Changed my mind, I do not want notifications any more!")
    // 	subscription.unsubscribe();
    // }, 10);
}

function rxTest(window, getJSON, showMovieLists, showError) {
    var movieListsSequence =
        Observable.zip(
            getJSON("http://api-global.netflix.com/abTestInformation").concatMap(function(abTestInformation) {
                return Observable.zip(
                    getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config").concatMap(function(config) {
                        if (config.showInstantQueue) {
                            return getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue").
                            map(function(queueMessage) {
                                return queueMessage.list;
                            });
                        } else {
                            return Observable.returnValue(undefined);
                        }
                    }),
                    getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists"),
                    function(queue, movieListsMessage) {
                        var copyOfMovieLists = Object.create(movieListsMessage.list);
                        if (queue !== undefined) {
                            copyOfMovieLists.push(queue);
                        }

                        return copyOfMovieLists;
                    });
            }),
            Observable.fromEvent(window, "load"),
            function(movieLists, loadEvent) {
                return movieLists;
            });

    movieListsSequence.
    forEach(
        function(movieLists) {
            showMovieLists(movieLists);
        },
        function(err) {
            showError(err);
        });
}
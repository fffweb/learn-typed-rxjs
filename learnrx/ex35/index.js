
$(document).ready(function () {



    // Your code here.

    test();

});

function test() {
    $.getJSON(
        "http://api-global.netflix.com/queue",
        {
            success: function (json) {
                alert("Data has arrived.");
            },
            error: function (ex) {
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
        errorHandler = function () {
            // Otherwise show the error.
            error = "There was a connectivity error";

            // We may be ready to display out
            tryToDisplayOutput();
        },
        tryToDisplayOutput = function () {
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
                }
                else if (error) {
                    outputDisplayed = true;
                    showError(error);
                }
            }
        },
        windowLoadHandler = function () {
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
        "http://api-global.netflix.com/abTestInformation",
        {
            success: function (abTestInformation) {
                // Request the member's config information to determine whether their instant
                // queue should be displayed.
                $.getJSON(
                    "http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config",
                    {
                        success: function (config) {
                            // Parallel retrieval of movie list could've failed,
                            // in which case we don't want to issue this call.
                            if (!error) {
                                // If we're supposed to
                                if (config.showInstantQueue) {
                                    $.getJSON(
                                        "http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue",
                                        {
                                            success: function (queueMessage) {
                                                queueList = queueMessage.list;

                                                configDone = true;
                                                tryToDisplayOutput();
                                            },
                                            error: errorHandler
                                        });
                                }
                                else {
                                    configDone = true;
                                    tryToDisplayOutput();
                                }
                            }
                        },
                        error: errorHandler
                    });

                // Retrieve the movie list
                $.getJSON(
                    "http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists",
                    {
                        success: function (movieListMessage) {
                            movieLists = movieListMessage.list;
                            tryToDisplayOutput();
                        },
                        error: errorHandler
                    });
            },
            error: errorHandler
        });
}


function test2(window, $) {
    var getJSON = function (url) {
        return Observable.create(function (observer) {
            var subscribed = true;

            $.getJSON(url,
                {
                    success:
                    function (data) {
                        // If client is still interested in the results, send them.
                        if (subscribed) {
                            // Send data to the client
                            observer.next(data);
                            // Immediately complete the sequence
                            observer.complete();
                        }
                    },
                    error: function (ex) {
                        // If client is still interested in the results, send them.
                        if (subscribed) {
                            // Inform the client that an error occurred.
                            observer.error(ex);
                        }
                    }
                });

            // Definition of the Subscription objects unsubscribe (dispose in RxJS 4) method.
            return function () {
                subscribed = false;
            }
        });
    };

    var observer = {
        // onNext in RxJS 4
        next: function (data) {
            alert(JSON.stringify(data));
        },
        // onError in RxJS 4
        error: function (err) {
            alert(err);
        },
        // onComplete in RxJS 4
        complete: function () {
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

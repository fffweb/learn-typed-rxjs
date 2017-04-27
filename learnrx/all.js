Array.prototype.map = function (projectionFunction) {
    var results = [];
    this.forEach(function (itemInArray) {
        results.push(projectionFunction(itemInArray));

    });

    return results;
};

Array.prototype.concatAll = function () {
    var results = [];

    this.forEach(function (subArray) {
        results.push.apply(results, subArray);
    });

    return results;
};

Array.prototype.concatMap = function (projectionFunctionThatReturnsArray) {
    return this.
        map(function (item) {
            return projectionFunctionThatReturnsArray(item);
        }).
        // apply the concatAll function to flatten the two-dimensional array
        concatAll();
};

Array.prototype.reduce = function (combiner, initialValue) {
    var counter,
        accumulatedValue;

    // If the array is empty, do nothing
    if (this.length === 0) {
        return this;
    }
    else {
        // If the user didn't pass an initial value, use the first item.
        if (arguments.length === 1) {
            counter = 1;
            accumulatedValue = this[0];
        }
        else if (arguments.length >= 2) {
            counter = 0;
            accumulatedValue = initialValue;
        }
        else {
            throw "Invalid arguments.";
        }

        // Loop through the array, feeding the current value and the result of
        // the previous computation back into the combiner function until
        // we've exhausted the entire array and are left with only one value.
        while (counter < this.length) {
            accumulatedValue = combiner(accumulatedValue, this[counter])
            counter++;
        }

        return [accumulatedValue];
    }
};

// Exercise 22: Implement zip


Array.zip = function (left, right, combinerFunction) {
    var counter,
        results = [];

    for (counter = 0; counter < Math.min(left.length, right.length); counter++) {
        // Add code here to apply the combinerFunction to the left and right-hand items in the respective arrays
        results.push(combinerFunction(left[counter], right[counter]));
    }

    return results;
};

var testzip = JSON.stringify(Array.zip([1, 2, 3], [4, 5, 6], function (left, right) { return left + right })) === '[5,7,9]'

console.log("testzip :" + testzip);


// test Array.push.apply method
var a = [1, 2, 3, 4]
// a.push([8,9,0]); will cause  a array pushed as object
var c = Array.prototype.push(a, [8, 9]); // no use

var ex10 = function () {
    // Array.prototype.concatAll = function () {
    //     var results = [];
    //     this.forEach(function (subArray) {
    //         // ------------ INSERT CODE HERE! ----------------------------
    //         // Add all the items in each subArray to the results array.
    //         // ------------ INSERT CODE HERE! ----------------------------
    //         subArray.forEach(function (obj) {
    //             results.push(obj);
    //         });
    //     });

    //     return results;
    // };

    // JSON.stringify([[1, 2, 3], [4, 5, 6], [7, 8, 9]].concatAll()) === "[1,2,3,4,5,6,7,8,9]"
    return JSON.stringify([[1, 2, 3], [4, 5, 6], [7, 8, 9]].concatAll());
    // [1,2,3].concatAll(); // throws an error because this is a one-dimensional array
}

console.log(ex10());

var test_concatMap = function () {
    var spanishFrenchEnglishWords = [["cero", "rien", "zero"], ["uno", "un", "one"], ["dos", "deux", "two"]];
    // collect all the words for each number, in every language, in a single, flat list
    var allWords = [0, 1, 2].
        concatMap(function (index) {
            return spanishFrenchEnglishWords[index];
        });

    return JSON.stringify(allWords); //=== '["cero","rien","zero","uno","un","one","dos","deux","two"]';
}

console.log(test_concatMap());

// reduce array
(function () {
    var boxarts = [
        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
        { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
        { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
        { width: 425, height: 150, url: "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg" }
    ],
        currentSize,
        maxSize = -1,
        largestBoxart;

    boxarts.forEach(function (boxart) {
        currentSize = boxart.width * boxart.height;
        if (currentSize > maxSize) {
            largestBoxart = boxart;
            maxSize = currentSize;
        }
    });

    console.log(largestBoxart);
    return largestBoxart;
}
)();

// Exercise 17: Retrieve the largest rating.
(function () {
    var ratings = [2, 3, 1, 4, 5];

    return ratings.
        reduce(function (acc, curr) {
            if (acc > curr) {
                return acc;
            }
            else {
                return curr;
            }
        });
})();
// Exercise 20: Retrieve the id, title, and smallest box art url for every video.
var ex20 = function () {
    var movieLists = [
        {
            name: "New Releases",
            videos: [
                {
                    "id": 70111470,
                    "title": "Die Hard",
                    "boxarts": [
                        { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" }
                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 4.0,
                    "bookmark": []
                },
                {
                    "id": 654356453,
                    "title": "Bad Boys",
                    "boxarts": [
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
                        { width: 140, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" }

                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 5.0,
                    "bookmark": [{ id: 432534, time: 65876586 }]
                }
            ]
        },
        {
            name: "Thrillers",
            videos: [
                {
                    "id": 65432445,
                    "title": "The Chamber",
                    "boxarts": [
                        { width: 130, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" }
                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 4.0,
                    "bookmark": []
                },
                {
                    "id": 675465,
                    "title": "Fracture",
                    "boxarts": [
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
                        { width: 120, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
                        { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" }
                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 5.0,
                    "bookmark": [{ id: 432534, time: 65876586 }]
                }
            ]
        }
    ];


    // Use one or more concatMap, map, and reduce calls to create an array with the following items (order doesn't matter)
    // [
    //	 {"id": 675465,"title": "Fracture","boxart":"http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
    //	 {"id": 65432445,"title": "The Chamber","boxart":"http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
    //	 {"id": 654356453,"title": "Bad Boys","boxart":"http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" },
    //	 {"id": 70111470,"title": "Die Hard","boxart":"http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" }
    // ];

    var result = movieLists.
        concatMap(function (movieList) {
            return movieList.videos.concatMap(function (video) {
                return video.boxarts.reduce(function (acc, curr) {
                    if (acc.width * acc.length > curr.width * curr.length) {
                        return curr;
                    } else {
                        return acc;
                    }
                })
            })
        });

    return movieLists.
        concatMap(function (movieList) {
            return movieList.videos.concatMap(function (video) {
                return video.boxarts.reduce(function (acc, curr) {
                    if (acc.width * acc.length > curr.width * curr.length) {
                        return curr;
                    } else {
                        return acc;
                    }
                }).map(function (boxart) {
                    return { id: video.id, title: video.title, url: boxart.url }
                })
            })
        });
    // return movieLists.
    //     concatMap(function (movieList) {
    //         return movieList.videos;
    //     }).map(function (movie) {
    //         return {
    //             id: movie.id,
    //             title: movie.title,
    //             boxart: movie.boxarts.reduce(function (acc, curr) {
    //                 if (acc.width < curr.width) {
    //                     return acc;
    //                 } else {
    //                     return curr;
    //                 }
    //             })
    //         }
    //     }).map(function (movie) {
    //         return { id: movie.id, title: movie.title, url: movie.boxart[0].url }
    //     });

}

console.log(ex20());
// Zipping Arrays
// Sometimes we need to combine two arrays by progressively taking an item from each and combining the pair. If you visualize a zipper, where each side is an array, and each tooth is an item, you'll have a good idea of how the zip operation works.
// Exercise 21: Combine videos and bookmarks by index
(function () {
    var videos = [
        {
            "id": 70111470,
            "title": "Die Hard",
            "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 4.0,
        },
        {
            "id": 654356453,
            "title": "Bad Boys",
            "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 5.0,
        },
        {
            "id": 65432445,
            "title": "The Chamber",
            "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 4.0,
        },
        {
            "id": 675465,
            "title": "Fracture",
            "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 5.0,
        }
    ],
        bookmarks = [
            { id: 470, time: 23432 },
            { id: 453, time: 234324 },
            { id: 445, time: 987834 }
        ],
        counter,
        videoIdAndBookmarkIdPairs = [];

    for (counter = 0; counter < Math.min(videos.length, bookmarks.length); counter++) {
        // Insert code here to create a {videoId, bookmarkId} pair and add it to the videoIdAndBookmarkIdPairs array.
        // videos.forEach(function(video){
        // if(video.id == bookmarks[counter].id){
        videoIdAndBookmarkIdPairs.push({ videoid: videos[counter].id, bookmarkid: bookmarks[counter].id });
        // }
        // })
    }

    console.log(videoIdAndBookmarkIdPairs);
    return videoIdAndBookmarkIdPairs;
}
)();

// Exercise 23: Combine videos and bookmarks by index
(function () {
    var videos = [
        {
            "id": 70111470,
            "title": "Die Hard",
            "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 4.0,
        },
        {
            "id": 654356453,
            "title": "Bad Boys",
            "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 5.0,
        },
        {
            "id": 65432445,
            "title": "The Chamber",
            "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 4.0,
        },
        {
            "id": 675465,
            "title": "Fracture",
            "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
            "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 5.0,
        }
    ],
        bookmarks = [
            { id: 470, time: 23432 },
            { id: 453, time: 234324 },
            { id: 445, time: 987834 }
        ];

    var result = Array.
        zip(videos, bookmarks, function (left, right) {
            return { videoid1: left.id, bookmarkid1: right.id };
        });
    console.log(result);
    return result;
}
)();


(function () {
    var movieLists = [
        {
            name: "New Releases",
            videos: [
                {
                    "id": 70111470,
                    "title": "Die Hard",
                    "boxarts": [
                        { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" }
                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 4.0,
                    "interestingMoments": [
                        { type: "End", time: 213432 },
                        { type: "Start", time: 64534 },
                        { type: "Middle", time: 323133 }
                    ]
                },
                {
                    "id": 654356453,
                    "title": "Bad Boys",
                    "boxarts": [
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
                        { width: 140, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" }

                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 5.0,
                    "interestingMoments": [
                        { type: "End", time: 54654754 },
                        { type: "Start", time: 43524243 },
                        { type: "Middle", time: 6575665 }
                    ]
                }
            ]
        },
        {
            name: "Instant Queue",
            videos: [
                {
                    "id": 65432445,
                    "title": "The Chamber",
                    "boxarts": [
                        { width: 130, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" }
                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 4.0,
                    "interestingMoments": [
                        { type: "End", time: 132423 },
                        { type: "Start", time: 54637425 },
                        { type: "Middle", time: 3452343 }
                    ]
                },
                {
                    "id": 675465,
                    "title": "Fracture",
                    "boxarts": [
                        { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
                        { width: 120, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
                        { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" }
                    ],
                    "url": "http://api.netflix.com/catalog/titles/movies/70111470",
                    "rating": 5.0,
                    "interestingMoments": [
                        { type: "End", time: 45632456 },
                        { type: "Start", time: 234534 },
                        { type: "Middle", time: 3453434 }
                    ]
                }
            ]
        }
    ];

    //------------ COMPLETE THIS EXPRESSION --------------
    // Exercise 24: Retrieve each video's id, title, middle interesting moment time, and smallest box art url.
    var result = movieLists.
        concatMap(function (movieList) {
            return movieList.videos.concatMap(function (video) {
                return video.boxarts.reduce(function (acc, cur) {
                    if (acc.width * acc.height < cur.width * cur.height) {
                        return acc;
                    } else {
                        return cur;
                    }
                }).map(function (boxart) {
                    return video.interestingMoments.reduce(function (acc, cur) {
                        if (cur.type == 'Middle') {
                            return cur;
                        } else {
                            return acc;
                        }
                    }).map(function (interestingMoment) {
                        return { id: video.id, title: video.title, time: interestingMoment.time, url: boxart.url }
                    })

                })
            })
        });

    console.log(result);

    // Exercise 24: Retrieve each video's id, title, middle interesting moment time, and smallest box art url.
    var result1 = movieLists.concatMap(function (movieList) {
        return movieList.videos.concatMap(function (video) {
            return Array.zip(
                video.boxarts.reduce(function (acc, curr) {
                    if (acc.width * acc.height < curr.width * curr.height) {
                        return acc;
                    }
                    else {
                        return curr;
                    }
                }),
                video.interestingMoments.filter(function (interestingMoment) {
                    return interestingMoment.type === "Middle";
                }),
                function (boxart, interestingMoment) {
                    return { id: video.id, title: video.title, time: interestingMoment.time, url: boxart.url };
                });
        })
    });

    console.log(result1);
    console.log(result == result1);
    return result;
}
)();

// Exercise 25: Converting from Arrays to Trees
(function () {
    var lists = [
        {
            "id": 5434364,
            "name": "New Releases"
        },
        {
            "id": 65456475,
            "name": "Thrillers"
        }
    ],
        videos = [
            {
                "listId": 5434364,
                "id": 65432445,
                "title": "The Chamber"
            },
            {
                "listId": 5434364,
                "id": 675465,
                "title": "Fracture"
            },
            {
                "listId": 65456475,
                "id": 70111470,
                "title": "Die Hard"
            },
            {
                "listId": 65456475,
                "id": 654356453,
                "title": "Bad Boys"
            }
        ];
    // Exercise 25: Converting from Arrays to Trees

    var result = lists.map(function (list) {
        return {
            name: list.name,
            videos:
            videos.filter(function (video) {
                return video.listId === list.id;
            }).map(function (video) {
                return { id: video.id, title: video.title }
            })
        }
    })

    console.log(result);

    return result;
})();

// Exercise 26: Converting from Arrays to Deeper Trees
(function () {
    var lists = [
        {
            "id": 5434364,
            "name": "New Releases"
        },
        {
            "id": 65456475,
            name: "Thrillers"
        }
    ],
        videos = [
            {
                "listId": 5434364,
                "id": 65432445,
                "title": "The Chamber"
            },
            {
                "listId": 5434364,
                "id": 675465,
                "title": "Fracture"
            },
            {
                "listId": 65456475,
                "id": 70111470,
                "title": "Die Hard"
            },
            {
                "listId": 65456475,
                "id": 654356453,
                "title": "Bad Boys"
            }
        ],
        boxarts = [
            { videoId: 65432445, width: 130, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
            { videoId: 65432445, width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" },
            { videoId: 675465, width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
            { videoId: 675465, width: 120, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
            { videoId: 675465, width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
            { videoId: 70111470, width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
            { videoId: 70111470, width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" },
            { videoId: 654356453, width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
            { videoId: 654356453, width: 140, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" }
        ],
        bookmarks = [
            { videoId: 65432445, time: 32432 },
            { videoId: 675465, time: 3534543 },
            { videoId: 70111470, time: 645243 },
            { videoId: 654356453, time: 984934 }
        ];

    // 
    var result_with_subarray = lists.map(function (list) {
        return {
            name: list.name,
            videos: videos.filter(function (video) {
                if (video.listId == list.id) {
                    return video;
                }
            }).map(function (video) {
                return {
                    id: video.id,
                    title: video.title,
                    time: bookmarks.filter(function (bookmark) {
                        if (bookmark.videoId === video.id) {
                            return bookmark.time;
                        }
                    }),
                    url: boxarts.filter(function (boxart) {
                        if (boxart.videoId === video.id) {
                            return boxart;
                        }
                    }).reduce(function (acc, curr) {
                        if (acc.height * acc.width < curr.height * curr.width) {
                            return acc;
                        } else {
                            return curr;
                        }
                    }).map(function (boxart) {
                        return boxart.url;
                    })
                }
            })
        }
    });

    var result = lists.map(function (list) {
        return {
            name: list.name,
            videos: videos.filter(function (video) {
                if (video.listId == list.id) {
                    return video;
                }
            }).concatMap(function (video) {
                return Array.zip(
                    boxarts.filter(function (boxart) {
                        if (boxart.videoId === video.id) {
                            return boxart;
                        }
                    }).reduce(function (acc, cuur) {
                        if (acc.height * acc.width < cuur.height * cuur.width) {
                            return acc;
                        } else {
                            return cuur;
                        }

                    }),
                    bookmarks.filter(function (bookmark) {
                        if (bookmark.videoId === video.id) {
                            return bookmark;
                        }
                    }),
                    function (boxart, bookmark) {
                        return { id: video.id, title: video.title, time: bookmark.time, url: boxart.url }
                    }
                )
            })
        }
    });
    console.log(result);

    return result;

}
)();
// Exercise 42: Retrying after errors
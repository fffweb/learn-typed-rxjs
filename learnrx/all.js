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

    return movieLists.
        concatMap(function (movieList) {
            return { id: movieList.id, title: movieList.title };
        })

}

console.log(ex20());
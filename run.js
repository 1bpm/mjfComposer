var normalise = require("./lib").normalise;
var source = require("./source");
var jazz = require("./jazzometer").lookup;

var searchers = [];

for (var r in source) {

    source[r].OTimeRef = source[r].Day + "" + source[r].Time;
    source[r].Artist.split(",").forEach(function (artist) {
        var a = source[r];
        searchers.append(function () {
            jazz.lookup(artist, function (res) {
                a.SearchResults = res;
            });
        });
    });

}

var normal = normalise(source);
var years = {};
var normalYears = {};

for (var r in source) {
    var row = source[r];
    var year = row.Year;
    if (!years[year])
        years[year] = [];
    years[year].push(source[r]);
}

for (var y in years) {
    normalYears[y] = normalise(years[y]);
}



function jazzFactor(r, n) {
    var value = r.Duration / r.Cost;
    var interest = 1 / r.Day;
}
;


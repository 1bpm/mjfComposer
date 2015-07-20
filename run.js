var normalise = require("./lib").normalise;
var source = require("./source");
var jazz = require("./jazzometer");
var searchers = [];
var events = {
    flute: [],
    mixer: [],
    sax: [],
    drums: [],
    bass: [],
    guit1: [],
    guit2: [],
    roles:[]
};

jazz("ass",function(e){console.log(e);});
process.exit();

for (var r in source) {

    source[r].OTimeRef = source[r].Day + "" + source[r].Time;

    // split by comma
    source[r].Artist.split(",").forEach(function (artist) {
        var a = source[r];
        searchers.append(function () {
            // get search result ratings
            jazz.lookup(artist, function (res) {
                a.SearchResults = res;
            });
        });
    });

}

var normal = normalise(source);
var years = {};
var normalYears = {};

// create year splits
for (var r in source) {
    var row = source[r];
    var year = row.Year;
    if (!years[year])
        years[year] = [];
    years[year].push(source[r]);
}

// normalise years
for (var y in years) {
    normalYears[y] = normalise(years[y]);
}

function DecTime(row) {
    var h = row.Time;
    var H = h.charAt(0) + h.charAt(1);
    var M = h.charAt(2) + h.charAt(3);
    row.NormalTime=(H + (M / 60)) / 24;
}

var factors=[
    {name:"approx notes per minute"},
    {name:"crowd pleasing"},
    {name:"professionalism"},
    {name:"attention to other performers"}
];


for (var y in years) {
    var days=[];
    for (var r in years[y]) {
        var row=years[y][r];
        days[row.Day]=row;
    }
}

function perform(role,ev,time) {
    events[role]=[ev,time];
}

function jazzFactor(r, n) {
    var value = r.Duration / r.Cost;
    var interest = 1 / r.Day;
}

//----------------------------------------------------------------------------


function gauge(t,p){
    $("#gauge").etc
}




// algo shit
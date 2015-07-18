var normalise = require("./lib").normalise;
var source = require("./source");
var jazz = require("./jazzometer").lookup;
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


new TextEvent("Silent","silent");
new TextEvent("One short note","one");

var introTime=10000;
var tTime=0;
var rls=Object.keys(roles).slice();
for (var i=0;i<rls.length;i++) {
    var r=rls[i];
    var tm=(introTime/rls.length)*i;
    if (i!==0) perform(r,"silent",tm);
    perform(r,"one",1435);
    if (i===rls.length-1) perform(r,"silent",introTime-tm);
}

perform("Drums",new TextEvent("Trad jazz, heavy on the ride pulse"),5435);
perform("Bass",new TextEvent("Trad jazz, logical scales"),5435);
perform(["Flute","Guitar 1","Guitar 2","Mixer"],"silent",10435);
perform("Sax","silent",4000);perform("Sax","Harsh scream",1435);
perform(["Bass","Sax"],"silent",5000);
perform("Drums",new TextEvent("Pretty jazzy fill quickly turning to abstract ridiculousness"),5000);

perform(roles,new TextEvent("Sustained chord/note/hit, low in pitch"),3000);
new TextEvent("Like that, but a bit higher pitched","likethat");
perform(roles,"likethat",2500);
perform(roles,"likethat",2000);
perform(roles,"likethat",1500);
perform(roles,"likethat",1000);
perform(roles,"likethat",500);
perform(roles,"likethat",500);
perform(roles,"silent",2500);
perform(roles,new TextEvent("Sustained horrible discordant noise"),3000);
perform(roles,"silent",3000);

// algo shit
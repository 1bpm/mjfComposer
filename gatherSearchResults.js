var normalise = require("./lib/analysis").normalise;
var source = require("./data/source.json");
var jazz = require("./lib/jazzometer");
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

// update source file with jazzometer search results


for (var r in source) {
    source[r].OTimeRef = source[r].Day + "" + source[r].Time;

    // split by comma
    source[r].Artist.split(",").forEach(function (artist) {
        var a = source[r];
        if (!a.SearchResults) {
        searchers.push([function () {
                console.log(artist);
            // get search result ratings
            jazz(artist, function (res) {
                console.log(res);
                a.SearchResults = res;
                console.log("add",a);
            });
        },r]);
        }
    });

}


function next() {
    var thiss=searchers.splice(searchers.length-1)[0];
    if (!thiss) {
        fs.writeFileSync("./process.json",JSON.stringify(source));
        process.exit();
    } else {
        var res=thiss[0]();
        setTimeout(next,60000);
        require("fs").writeFileSync("./process.json",JSON.stringify(source));
    }
}

next();

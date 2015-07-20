var xpath = require('xpath')
        , dom = require('xmldom').DOMParser,
        http = require("http");

module.exports=function lookup(term,procFunc) {
    var tms=["","raw","jazz","albums","live","review", "gigs","sucks","rocks", "not jazz"];
    var res={};
    var comp=0;
    for (var x in tms) {
        if (!res[tms[x]]) res[tms[x]]={};
        var theTerm=(tms[x]==="raw")?term+tms[x]:"\""+term+"\" "+tms[x];
        doLookup(theTerm,function(r){
            res[tms[x]].push(r.num);
            console.log(tms[x],r.num);
            if (comp++>=tms.length) procFunc(res);
        });
    }
    
    function doLookup(query, fn) {
        http.get({
            host: "www.google.com",
            port: 80,
            path: "/search?q=" + encodeURIComponent(query)
        }, function(res) {
            var xmRes = [];
            res.on("data", function(c) {
                xmRes.push(c);
            });
            res.on("end", function() {
                parseUp(xmRes.join(""));
            });
        });
        function parseUp(xml) {
            try {
                var doc = new dom({locator: {}, errorHandler: {warning: function() {
                        }, error: function() {
                        }, fatalError: function() {
                        }}}).parseFromString(xml);
                var nodes = xpath.select(".//*[@id='resultStats']", doc);
            } catch (e) {
                console.log("error");
            }
           
            if (nodes.length > 0) {
                var res = nodes[0].firstChild.data;
                var num = res.replace("About ", "").replace(" results", "").replace(/,/g, "");
                
                fn({query:query,num:num}); //console.log(num);
            } else {
                console.log(xml);
            }
        }
    }
    //procFunc(res);
};


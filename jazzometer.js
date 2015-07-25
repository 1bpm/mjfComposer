var xpath = require('xpath')
        , dom = require('xmldom').DOMParser,
        http = require("http");

module.exports=function lookup(term,procFunc) {
    var tms=["raw","jazz","albums","live","review", "gigs","sucks","rocks", "\"not jazz\""];
    var res={};
    var comp=0;
    var toDo=[];
    
    function nxt() {
        var theTermx=toDo.splice(toDo.length-1)[0];
        if (!theTermx) return;
        console.log(theTermx);
        var theTerm=theTermx[0];
        var vi=theTermx[1];
        doLookup(theTerm,vi,function(ref,num){
            res[ref]=num;
            comp++;
            if (comp>=tms.length) procFunc(res);
            //console.log(res);
        });
        
        setTimeout(nxt,5000);
        
    }
    
    for (var x in tms) {
        if (!res[tms[x]]) res[tms[x]]=0;
        var theTerm=(tms[x]==="raw")?"\""+term+"\"":"\""+term+"\" " +tms[x];
        toDo.push([theTerm,tms[x]]);
    }
    
    nxt();
    
    function doLookup(query, ref,fn) {
        http.get({
            host: "www.google.com",//.co.uk
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
           
            try {
            if (nodes.length > 0) {
                var res = nodes[0].firstChild.data;
                var num = res.replace("About ", "").replace(" results", "").replace(/,/g, "");
                console.log(num);
                //res[ref]=num;//ref.push({query:query,num:num});
                fn(ref,num);
            } else {
                //fn(ref,0);
                console.log(xml);
            }
        } catch (e) {
            fn(ref,0);
        }
        }
    }
    //procFunc(res);
};


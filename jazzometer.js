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
        if (!theTermx) {
            procFunc(res);
            return;
        }
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
        var theUrl="/search?q=" + encodeURIComponent(query);
        //console.log(theUrl);
        var https=require("https");
//        http.get({
//            host: "www.google.co.uk",//.co.uk
//            headers:{"user-agent":
//                        "Mozilla/5.0 (X11; Linux i686; rv:31.0) Gecko/20100101 Firefox/31.0 Iceweasel/31.6.0",
//                "Cookie":"GOOGLE_ABUSE_EXEMPTION=ID=d36562ccbc4a2d3c:TM=1437831999:C=c:IP=89.242.214.15-:S=APGng0uemNbfXfzRz9dmqrFKiQq1tD45vA"
//            },
//            port: 80,
//            path: theUrl
//        }, 
var abuse="ID=07ee1bbb47ebf426:TM=1437842106:C=c:IP=89.242.214.15:S=APGng0vK43u6kxekkVnM5kV_pFOrCQR3jw";
var a=https.request({hostname:"www.google.co.uk",headers:{"user-agent":
                        "Mozilla/5.0 (X11; Linux i686; rv:31.0) Gecko/20100101 Firefox/31.0 Iceweasel/31.6.0",
                "Cookie":"GOOGLE_ABUSE_EXEMPTION="+abuse
            },path:theUrl,port:443,method:"GET"},
        function(res) {
            //console.log(res);
            var xmRes = [];
            res.on("data", function(c) {
                xmRes.push(c);
            });
            res.on("end", function() {
                parseUp(xmRes.join(""));
            });
        });a.end();
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
    
};


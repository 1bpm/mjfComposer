var source=require("./data/source");
var lib=require("./lib/analysis");
var normalise=lib.normalise;

var years = {};
var normalYears = {};

function DecTime(row) {
    var h = row.Time.toString();
    var H = parseInt(h.charAt(0) + h.charAt(1));
    var M = parseInt(h.charAt(2) + h.charAt(3));
    row.NormalTime=(H + (M / 60)) / 24;
    row.RelativeDuration=(row.Duration/60)/24;   
}

//relativeDuration //* about 200000

var searchSub=[];
// create year splits
var dtrak={};
for (var r in source) {
    var row = source[r];
    DecTime(row);
    if (row.SearchResults) {
        var o={};
        for (var k in row.SearchResults) {
            var v=row.SearchResults[k];
            try {
                var x=parseInt(v);
                if (x>150000) {
                    x=150000;
                }
                o[k]=x;
            } catch(e) { 
                o[k]=0;
            }
            
        }
        searchSub.push(o);
    } else {
        searchSub.push({raw:0});
    }
    var year = row.Year;
    if (!years[year])
        years[year] = [];
    years[year].push(source[r]);
  
}

var normal = normalise(source);
var nsearch=normalise(searchSub);

for (var r in source) {
    var trow=source[r];
    for (var s in source) {
        var srow=source[s];
        if (trow.Day===srow.Day &&
                trow.Year===srow.Year &&
                trow.NormalTime>srow.NormalTime &&
                trow.NormalTime<(srow.NormalTime+srow.RelativeDuration)
                ) {
            //console.log(trow,srow);
            trow.ClashLast=true;
            srow.ClashNext=true;
        }
    }
}





for (var r in nsearch) {
    normal[r].SearchResults=nsearch[r];
}

// normalise years
for (var y in years) {
    normalYears[y] = normalise(years[y]);
}





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
var pad = function (e, doPad) {
        var o = [];
        for (var nm in roles) {
            var roleparts = false;
            for (var rn in e.roles) {
                var rnm = e.roles[rn];
                if (rnm === nm) {
                    roleparts = true;
                }
            }
            if (roleparts) {
                o.push({role: nm, event: e.event, duration: e.duration});
            } else if ((!doPad) || (doPad && nm!=="Drums" && nm!=="Bass")) {
                o.push({role: nm, event: "silent", duration: e.duration});
            }
        }
        return o;
    };
    
    
var days={};

var roles=["Flute/Feedback", "Saxophone", "Guitar1", "Guitar2", "Bass", "Drums", "Mixer"];
var searches=["jazz","live","review", "gigs","sucks","rocks", "\"not jazz\""];
var role=0;
for (var x in source) {
    var row=source[x];
    var n=normal[x];
    if (!days[row.Year]) days[row.Year]={};
    if (!days[row.Year][row.Day]) days[row.Year][row.Day]={totaltime:0,e:[],n:[]};
    var d=days[row.Year][row.Day];
    d.totaltime+=row.Time;
    d.e.push(row);
    d.n.push(n);
}

function nextRole(x) {
    if (roles[x+1]) return 0;
    return x+1;
}
function lastRole(x) {
    if (roles[x-1]) return x-1;
    return roles[roles.length-1];
}

function bringin(val){
    if (parseFloat(val)>0.5) return val*0.8;
    if (parseFloat(val)<0.5) return val*1.2;
    return 0.5;
}
var totalDuration=0;
var data={};
var perf=[];
var tr=0;
var roledur={};
for (var y in days) { // each year
    var ye=days[y];
    var ydata={};
    var yearDuration=0;
    var carrynotes=[];
    for (var d in ye) { // each day
        var day=ye[d];
        var duration=day.totaltime*5;
        totalDuration+=duration;
        yearDuration+=duration;
        var role1=roles[tr];
        if (!roledur[role1]) roledur[role1]=0;
        tr++;
        if (tr===roles.length-1) tr=0;
        var role2=roles[tr];
        var notes=[];
        for (var ev in day.e) {
            var n=day.n[ev];
            var r=day.e[ev];
//            notes.push([role1,n.Time,n.Duration,bringin(n.SearchResults.rocks||n.Venue)]);
            var vl=bringin(1-(n.SearchResults.rocks)*0.7||n.Venue);
            var dur=n.Duration*1.1;
            if (r.ClashNext || r.ClashLast) {
                dur*=1.3;
                vl=[vl,1-(n.SearchResults.sucks)*0.8||n.Artist];
            }
            notes.push(["green",n.Time,dur,vl]);
            
            if (n.Cost>0.8) {
                var c=["blue",(n.Time+n.Duration)*2.5,n.Duration*2.5,n.Cost*0.3];
                notes.push(c);
            }
            if (r.ClashNext) {
                var tn=["yellow",n.Time,n.Duration*2.5,(1-(n.SearchResults.sucks))*0.6||n.Artist];
                notes.push(tn);
                carrynotes.push(tn);
            }
            if (r.ClashLast) {
//                notes.push([roles[lastRole(tr)],n.Time,n.Duration*2,1-n.SearchResults.sucks||n.Venue]);
                notes.push(["red",n.Time,n.Duration*2.5,(1-(n.SearchResults.rocks))*0.7||n.Venue]);
            }
        }
        ydata[d]={duration:duration,notes:notes};
        //process.exit();
        duration=duration*0.374;
        roledur[role1]+=duration;
        perf.push({roles:[role1],duration:duration,event:"notes",notes:notes});    
    } // end of each day
    
    
    
    //perf.push({duration:y,event:"silent",roles:roles});
    data[y]=ydata;
} // each year
//console.log(roledur);
var max=0;
    for (var x in roles) {  
        var m=roles[x];
        if (roledur[m]>max) max=roledur[m];
    }

    for (var x in roles) {
        if (!roledur[roles[x]]) roledur[roles[x]]=0;
        var tm=max-roledur[roles[x]];
        var silencio={duration:tm,event:"silent",roles:[roles[x]]};
        if (tm>0) perf.push(silencio);
        //console.log(silencio);
    }

perf.push({duration:3141,event:"text",text:"raucous noise",roles:["Drums","Mixer"]});
perf.push({duration:3141,event:"silent",roles:["Flute/Feedback","Guit1","Guit2","Bass"]});

perf.push({duration:5000,event:"text",text:"static high frequency pitch",roles:["Mixer"]});
perf.push({duration:3000,event:"silent",roles:["Saxophone"]});
perf.push({duration:2000,event:"text",text:"raucous noise",roles:["Saxophone"]});

perf.push({duration:5000,event:"silent",roles:["Drums","Flute/Feedback","Guit1","Guit2","Bass"]});
perf.push({roles:roles,duration:5000,event:"notes",notes:[["green",0,1,0.5]]});
perf.push({roles:roles,duration:4000,event:"notes",notes:[["green",0,1,0.6]]});
perf.push({roles:roles,duration:3000,event:"notes",notes:[["green",0,1,0.7]]});
perf.push({roles:roles,duration:2000,event:"notes",notes:[["yellow",0,1,0.8]]});
perf.push({roles:roles,duration:1000,event:"notes",notes:[["red",0,1,0.9]]});
perf.push({roles:roles,duration:500,event:"notes",notes:[["red",0,1,1]]});

/*
var lastpoints={};
for (var y in days) { // each year
    var ye=days[y];
    var ydata={};
    var yearDuration=0;
    var carrynotes=[];
    for (var d in ye) { // each day
        var day=ye[d];
        var duration=day.totaltime*5;
        totalDuration+=duration;
        yearDuration+=duration;
        var eindex=0;
        for (var r in roles) {
            var role=roles[r];
            var ev=day.e[eindex];
            if (eindex>=day.e.length-1) {
                eindex=0;
            } else {
                eindex++;
            }
        if (!lastpoints[role]) lastpoints[role]={};
        var l=lastpoints[role];
        var n=day.n[eindex];
        var dur=n.Duration*10000;
        var contempt;
        var jazz=[];
        var nps=[];
        var curved=-1;
        if (n.SearchResults.rocks>0.9) {
           // curved=((n.Duration+n.Artist)/2)*10;
        }
        if (n.SearchResults.jazz>0.9999) {
            var jz=n.SearchResults.jazz*0.8;
            jazz=[l.jazz||0.2,jz];
            nps.push(["yellow",l.jz||0.2,jz,jz]);
            l.jazz=jz;
        }
        if (ev.ClashNext || ev.ClashLast) {
            dur=dur*n.SearchResults.rocks;
            if (dur<1000) {
                dur=(dur*10>2000)? dur*10 : dur*2;
            }
            var c=((n.SearchResults['"not jazz"']||n.Artist)+(n.SearchResults.sucks||n.Venue))/2;
            contempt=[
                l.contempt||0.2,
                c
            ];
            nps.push(["red",c,0.2,l.contempt||0.2]);
            l.contempt=c;
        }
        if (dur<4000) dur=dur*4;
        if (dur<1000) dur=dur*4;
       var p=bringin((n.SearchResults.jazz||n.Cost)+(n.SearchResults.gigs||n.Time)/2);
        var points=[
            l.p||0.2,p
            
        ];
        nps.push(["blue",p,(l.p||0.2),p]);
        l.p=p;
        var tev={
            roles:[role],duration:dur,event:"curve",points:{pitch:points,contempt:contempt,rhythmComplexity:jazz}
        };

if (!nps) console.log("None");
        tev={roles:[role],duration:dur,event:"notes",notes:nps};
        
        
        perf.push(tev);
        if (n.SearchResults.gigs<0.1) {
            var tnotes=[];
            for (var x=0; x<(n.Cost*10);x++) {
                tnotes.push(["black",x/10,n.Duration,(n.Duration+n.Cost)/1.6]);
            }
            perf.push({roles:[role],duration:dur*1.4,event:"notes",notes:tnotes});
            perf.push({roles:[role],duration:dur*1.4,event:"silent"});
        }
    }
    }
}

*/






require("fs").writeFileSync("./data/composition.json",JSON.stringify(perf));
//console.log(data[19]);
console.log(((totalDuration/1000)/60)/7);

//function pad (e, doPad) {
//        var o = [];
//        for (var nm in roles) {
//            var roleparts = false;
//            for (var rn in e.roles) {
//                var rnm = e.roles[rn];
//                if (rnm === nm) {
//                    roleparts = true;
//                }
//            }
//            if (roleparts) {
//                o.push({role: nm, event: e.event, duration: e.duration});
//            } else if (!doPad) {
//                o.push({role: nm, event: "silent", duration: e.duration});
//            }
//        }
//        return o;
//    };
//
//
//
//require("fs").writeFileSync("./processed.json",JSON.stringify({
//    source:source,
//    normal:normal,
//    years:years
//}));
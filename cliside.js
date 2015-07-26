


var dimen=[1024,768];

var svg=$("<svg />",{
    width:dimen[0]+"px",
    height:dimen[1]+"768px"
});

function curve(startRatio,endRatio,curvePosRatio,lineWidth) {
    var start=dimen[1]*(1-startRatio);
    var end=dimen[1]*(1-endRatio);
$("<path />",{
    fill:"transparent",
    "stroke-width":1,
    stroke:"blue",
    d:"M-1 "+start+" C100,100 900 100,"+(dimen[0]+10)+","+end
});

}




on run:
        
        

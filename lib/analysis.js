function charNumbers(str) {
    var data = {};
    var chars = [];
    var max = 0;
    var min = 999;
    var returner = [];
    for (var x = 0; x < str.length; x++) {
        var n = str.charCodeAt(x);
        chars.push(n);
        if (n > max)
            max = n;
        if (n < min)
            min = n;
    }
    for (var t in chars) {
        returner.push((chars[t] - min) * (1 / (max - min)));
    }
    return returner;
}

function nWordNumbers(str) {
    var chars="a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");
    
}

function wordNumbers(str) {
    var returner = [];
    var splits = str.split(" ");
    for (var i in splits) {
        returner.push(charNumbers(splits[i]));
    }
    return returner;
}

function originality(table) {
    
}

function normalise(table) {
    var max = {}; 
    var min = {};
    var scale = {}; // do dat
    var result = [];
    for (var r in table) { // numeric index
        var row = table[r];
        for (var c in row) {
            var col = row[c];
            if (typeof col !== "number") {
                if (parseFloat(col) === col) {
                    col = parseFloat(col);
                } else {

                    if (!scale[c]) {
                        scale[c] = {};
                        
                    }
                    scale[c][col] = Object.keys(scale[c]).length + 1;
                }
            } else {
                col=parseFloat(col);
            }

            if (typeof col === "number") {

                if (!max[c])
                    max[c] = 0;
                if (!min[c] && min[c]!==0)
                    min[c] = 99999999999;
                if (col > max[c])
                    max[c] = col;
                if (col < min[c]) 
                    min[c] = col;
            }
        }
        
    } 
    for (var r in table) {
        var row = table[r];
        var res = {};
        for (var c in row) {
            var col = row[c];
            if (!isNaN(min[c]) && !isNaN(max[c])) {
                var test=(1 / (max[c] - min[c])) * (col - min[c]);
                if (!isNaN(test)) res[c] = test;
            } else if (scale[c]) {
                res[c] = (1 / Object.keys(scale[c]).length) * (scale[c][col]-1);
            }
        }
        result.push(res);
    }
    return result;
}


module.exports = {
    normalise: normalise,
    wordNumbers: wordNumbers,
    charNumbers: charNumbers
};
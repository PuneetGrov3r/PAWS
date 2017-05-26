var python = require('./node-python/lib/python').shell;



function helperFunctions(){
}

function pythonIntegrate(){
}

helperFunctions.prototype.mainParse = (data, callback) => {
    callback( null, data.replace(/[()\[\]',]/g, "").slice(0,-1).split(" ") );
}


pythonIntegrate.prototype.parseStanParser = (data, callback) => {
  var helper = new helperFunctions();
  helper.mainParse(data, function(err, data){
    var arr = [];
    if(err) callback(err, null);
    else{
      var t = data;
      for(var i = 0; i<t.length; i=i+5){
        var temp = t.slice(i, i+5);
        var temp2 = [];
        temp2.push(temp.slice(0,2));
        temp2.push(temp[2]);
        temp2.push(temp.slice(3,5));
        arr.push(temp2);
      }
      callback(null, arr);
    }
  })
}

pythonIntegrate.prototype.synonymParser = (err, data) => {
  var helper = new helperFunctions();
  helper.mainParse(data, function(err, data){
    if(err) console.log(err);
    else{
      var seen = {};
      var out = [];
      var len = data.length;
      var j = 0;
      for(var i = 0; i < len; i++) {
           var item = data[i];
           if(seen[item] !== 1) {
                 seen[item] = 1;
                 out[j++] = item;
           }
      }
      console.log(out);
    }
  })
}

pythonIntegrate.prototype.parseNV = (err, data ) => {
	if(data !== undefined){
      console.log(null, JSON.parse(data.slice(0,-1)) );
	}else{
		console.log(err);
	}
}



process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.write('from nltk.parse.stanford import StanfordDependencyParser\n');
process.stdin.write('from nltk.corpus import wordnet\n');
process.stdin.write('from sys import argv\n');
process.stdin.write('from sys.path import insert\n');
process.stdin.write('sys.path.insert(0, "./pythonFiles/")\n');
process.stdin.write('import main\n');

process.stdin.write('print(Synonym().getSynonyms("holiday"))\n');

process.stdin.on('data', function (chunk) {
	console.log(chunk);
	a = new pythonIntegrate();
	mycallback = a.synonymParser();
   python(chunk, mycallback);
});


process.stdin.on('end', function() {
   python('quit()');
});


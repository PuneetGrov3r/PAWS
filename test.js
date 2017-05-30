var pyInt = require('./pythonIntegrate');
var one = new pyInt.pythonIntegrate(), 
two = new pyInt.pythonIntegrate(), 
three = new pyInt.pythonIntegrate();
four = new pyInt.pythonIntegrate();

one.parseStanParser("They'll be coming tomorrow.", (err, data) => {
	if(err){
		console.log(`Error: ${err}`);
	}else{
		console.log(data);
	}
})

two.synonymParser("holiday", (err, data) => {
	if(err){
		console.log(`Error: ${err}`);
	}else{
		console.log(data);
	}
})

three.parseNV("I need a definition", (err, data) => {
	if(err){
		console.log(`Error: ${err}`);
	}else{
		console.log(data);
	}
})

four.fuzzy(['ef',['abc','def','ghi','jkl','mno','pqr']], (err, data) => {
  if(err) throw new Error(err);
  else{
    console.log(data);
  }
})
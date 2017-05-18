var pyInt = require('./pythonIntegrate');


var one = new pyInt.pythonIntegrate(), 
two = new pyInt.pythonIntegrate(), 
three = new pyInt.pythonIntegrate();

one.parseStanParser("I want to book a flight for tokyo.", (err, data) => {
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

three.parseNV("I want to book a flight for tokyo.", (err, data) => {
	if(err){
		console.log(`Error: ${err}`);
	}else{
		console.log(data);
	}
})

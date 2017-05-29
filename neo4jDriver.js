let neo4j = require('neo4j')
let db = new neo4j.GraphDatabase('http://neo4j:server1graph@localhost:7474');
class Driver {
	contructor(){

	}

	getRootProperties(callback){

		db.cypher({
		    query: 'MATCH (a:ROOT) RETURN a',
		}, function (err, results) {
		    if (err) throw err;
		    var result = results[0];
		    if (!result) {
		        console.log('Error in finding the root node');
		        callback(new Error("db error"))
		    } else {
		        var rootNode = result['a'];
		        callback(rootNode["properties"]["keywords"])
		    }
		});



	}
	getLevel1Keywords(callback){
		

		db.cypher({
		    query: 'MATCH (:ROOT)-[]-(a:LEVEL1) RETURN a',
		    params:{
		    	//compName:"IndianRailways"
		    }
		}, function (err, results) {
		    if (err) throw err;
		    var result = results;
		    if (!result) {
		        console.log('Error in finding the root node');
		        callback(new Error("db error"))
		    } else {
		        //var rootNode = result['b'];
		        let returnArray = []
		        for(i in results)
		        {
		        	let tempObj = {}
		        	tempObj["keywords"] = results[i]["a"]["properties"]["keywords"]
		        	tempObj["company"] = results[i]["a"]["properties"]["company"]
		        	tempObj["id"] = results[i]["a"]["_id"]
		        	tempObj["function"]= results[i]["a"]["properties"]["function"]
		        	returnArray.push(tempObj)
		        }
		        callback(returnArray)
		    }
		});





	}

}
module.exports = Driver

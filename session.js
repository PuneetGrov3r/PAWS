let async = require("async")
let pyInt = require("./pythonIntegrate")
let neo4jDriver = require('./neo4jDriver.js')

let nlParser = new pyInt.pythonIntegrate()



function session(sessionId,latitude,longitude){

	let currentClass = this

	this.dbDriver  = new neo4jDriver()
	this.sessionId = sessionId
	this.latitude = latitude
	this.longitude = longitude
	
	this.words = {
		"verbs":[],
		"nouns":[],
		"processedVerbs":[],
		"processedNouns":[]
	}

	this.isComplete = false
	this.currentNode = -1
	this.currentStage = "rootFinder"
	this.allSynonyms = []
		
	console.log("before init")
		
	console.log("After")
	this.functionList = {
		"rootFinder" : currentClass.rootFinder,
		"companyFinder":currentClass.companyFinder
	}
		
	

	this.parseMessage = function(message,callback){
		console.log("inside parse message")

		nlParser.parseNV(message,(err,data)=>{

			//Assigning the the processed nouns and verbs to the object
			let dataObj = JSON.parse(data.slice(0,-1))
			currentClass.words["verbs"] = dataObj["Verb"]
			currentClass.words["nouns"] = dataObj["Noun"]
			let currentFunction = this[this.currentStage]
			currentFunction(currentClass,(neo4jObject,prevCallback)=>{

				//Ughhh
				if(neo4jObject["callNext"])currentClass[currentClass.currentStage](currentClass,prevCallback)
				else callback(neo4jObject["msg"])




				


			});


		});

		
		console.log("See here")
		
	}





	//Various stages
	this.rootFinder = function(currentClass,callback){

		currentClass.dbDriver.getRootProperties((rootProperties)=>{
			console.log("root properties")
			console.log(rootProperties)
			matchSynonyms(currentClass,rootProperties,currentClass.words["verbs"].concat(currentClass.words["nouns"]),(didMatch,matchedVerb)=>{
				if(didMatch)
				{	
					currentClass.currentStage = "companyFinder"
					callback({callNext:true,msg:"Matched"},callback)
				}
				else callback({callNext:false,msg:"NOMatch"},callback)
			})
		})
	}
	
	this.companyFinder = function(currentClass,callback){
		currentClass.dbDriver.getLevel1Keywords((arrayOfObjects)=>{
			
			console.log(arrayOfObjects)

			async.filter(arrayOfObjects,(item,cb1)=>{
				console.log("allSynonyms1")

				console.log(currentClass.allSynonyms)

			/*	if(currentClass.allSynonyms.length!=0)
				{
					console.log("allSynonyms")
					console.log(currentClass.allSynonyms)
					let keywords = item["keywords"].split(':')
					let ifFound = false
					for(i in keywords)
					{
						for(j in currentClass.allSynonyms)
						{
							if(keywords[i] == currentClass.allSynonyms[j])
							{
								ifFound = true
								cb1(null,true)
								break
							}
							if(ifFound)break
						}
					}
					if(!ifFound)cb1(null,false)
				}
				*/
				//else{
					matchSynonyms(currentClass,item["keywords"],currentClass.words["verbs"].concat(currentClass.words["nouns"]),(didMatch,matchedVerb)=>{
						if(didMatch)
						{
							console.log("Matched")
							console.log(item["keywords"])
							cb1(null,true)
						}
						else
						{
							cb1(null,false)
						}

					});
				//}
			},(err,results)=>{
				console.log("Conpany results")
				console.log(results)
				if(results.length == 0)
					callback({callNext:false,msg:"No company found"},callback)
				else
				{
					let resultString = []
					async.each(results,(item,cb1)=>{
						resultString.push(item["company"])
						cb1(null)
					},(err)=>{
						callback({callNext:false,msg:resultString.join()},callback)
					});
					
					
				}


			})







		})



	}


}


//Send true or false in callback
function matchSynonyms(currentClass,keywords,verbs,callback)
{
	console.log("MAtching now for",keywords)
	let keywordArray = keywords.split(":")
	async.detect(verbs,(item,cb1)=>{
		nlParser.synonymParser(item,(err,synonymArray)=>{
			console.log(synonymArray)
			currentClass.allSynonyms.concat(synonymArray)
			if(err)cb1(null,false)
			let ifFound = false
			for(i = 0;i<synonymArray.length ;i++)
			{
				for(j = 0;j<keywordArray.length;j++)
				{
					if(synonymArray[i] == keywordArray[j])
					{
						ifFound = true
						cb1(null,true)
						break

					}
					if(ifFound)break
				}
			}
			if(!ifFound)cb1(null,false)


		});

	},(err,result)=>{
		console.log("Verb match ",result)
		if(result){
			callback(true,result)
		}
		else{
			callback(false,undefined)
		}
	})

}





module.exports = session
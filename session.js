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
		"processedNouns":[],
		"allWords":[],
		"allSynonyms":[]
	}

	this.isComplete = false
	this.currentNode = -1
	this.currentStage = "rootFinder"
		
	
	this.functionList = {
		"rootFinder" : currentClass.rootFinder,
		"companyFinder":currentClass.companyFinder
	}
		
	this.companies = []



	this.parseMessage = function(message,messageType,callback){

		switch (messageType) {
			case "initialQuery":
				nlParser.parseNV(message,(err,data)=>{

				//Assigning the the processed nouns and verbs to the object
				let dataObj = JSON.parse(data.slice(0,-1))
				currentClass.words["verbs"] = dataObj["Verb"]
				currentClass.words["nouns"] = dataObj["Noun"]
				currentClass.words["allWords"] = dataObj["Verb"].concat(dataObj["Noun"])
				let currentFunction = this[this.currentStage]
				
				//Finding all synonyms of verbs and nouns
				findAllSynonyms(this.words.allWords,(allSynonyms)=>{
					currentClass.words.allSynonyms = allSynonyms

						currentFunction(currentClass,(neo4jObject,prevCallback)=>{

							if(neo4jObject["callNext"] == true)
								currentClass[currentClass.currentStage](currentClass,prevCallback)
							
							else callback({"message":neo4jObject["message"],type:neo4jObject["type"]})

						});
					});

				});
				break



			case "companyDisambiguation":
				console.log("Company disamb")
				//Check if single word or a sentence
				let isAWord = message.split(" ").length<=1
				if(isAWord)
				{
					findAllSynonyms([message],(allSynonyms)=>{
						async.filter(currentClass.companies,(item,cb1)=>{
							matchSynonyms(allSynonyms,item["keywords"],(didMatch)=>{
								if(didMatch){

									console.log("did match")
									console.log(allSynonyms,item["keywords"])
									cb1(null,true)
								}
								else{

									console.log("did not match")
									console.log(allSynonyms,item["keywords"])
									cb1(null,false)
								} 
							})
						},(err,resultArray)=>{
							if(resultArray.length>1){
								currentClass.companies = resultArray
								callback({
									callNext:false,
									message:companyDisambiguationMessageCreator(currentClass.companies),
									type:"companyDisambiguation"
								},callback)
							}
							else if(resultArray.length == 1)
							{
								currentClass.companies = resultArray
								currentClass.currentStage = "serviceFinder"
								callback({
									callNext:true,
									message:"companyFound",
									type:"serviceDisambiguation"
								},callback)
							}
							else
							{
								callback({
									callNext:false,
									message:companyDisambiguationMessageCreator(currentClass.companies),
									type:"companyDisambiguation"
								},callback)

							}
						})
					})

				}
				else
				{
					nlParser.parseNV(message,(err,data)=>{
						let dataObj = JSON.parse(data.slice(0,-1))
						let allWords =   dataObj["Verb"].concat(dataObj["Noun"])
				
						findAllSynonyms(allWords,(allSynonyms)=>{
							async.filter(currentClass.companies,(item,cb1)=>{
								matchSynonyms(allSynonyms,item["keywords"],(didMatch)=>{
									if(didMatch){

										console.log("did match")
										console.log(allSynonyms,item["keywords"])
										cb1(null,true)
									}
									else{

										console.log("did not match")
										console.log(allSynonyms,item["keywords"])
										cb1(null,false)
									} 
								})
							},(err,resultArray)=>{
								if(resultArray.length>1){
									currentClass.companies = resultArray

									callback({
										callNext:false,
										message:companyDisambiguationMessageCreator(currentClass.companies),
										type:"companyDisambiguation"
									},callback)
								}
								else if(resultArray.length == 1)
								{
									currentClass.companies = resultArray
									currentClass.currentStage = "serviceFinder"
									callback({
										callNext:true,
										message:"companyFound",
										type:"serviceDisambiguation"
									},callback)
								}
								else
								{
									callback({
										callNext:false,
										message:companyDisambiguationMessageCreator(currentClass.companies),
										type:"companyDisambiguation"
									},callback)

								}
							})
						})
					})

				}



				break

			case "serviceDisambiguation":
				console.log("inside service disamb")
				callback({callNext:false,message:"done",type:"serviceDisambiguation"},callback)
				break

			case "parameterFilling":
				break

		}


		

		
		
	}





	//Various stages
	this.rootFinder = function(currentClass,callback){

		currentClass.dbDriver.getRootProperties((rootProperties)=>{
			matchSynonyms(currentClass.words.allSynonyms,rootProperties,(didMatch)=>{
				console.log("inside rootFinder")
				console.log(currentClass.words.allSynonyms)
				if(didMatch)
				{	
					currentClass.currentStage = "companyFinder"
					callback({callNext:true,message:"Matched"},callback)
				}
				else callback({callNext:false,message:"NOMatch"},callback)
			})
		})
	}
	
	this.companyFinder = function(currentClass,callback){
		currentClass.dbDriver.getLevel1Keywords((arrayOfObjects)=>{
			

			async.filter(arrayOfObjects,(item,cb1)=>{

			
				matchSynonyms(currentClass.words.allSynonyms,item["keywords"],(didMatch)=>{
					if(didMatch)
					{
						cb1(null,true)
					}
					else
					{
						cb1(null,false)
					}
				});
			
			},(err,results)=>{
				if(results.length == 0)
					callback({callNext:false,message:"No service found",type:"initialQuery"},callback)

				else if(results.length > 1)
				{
					async.each(results,(item,cb1)=>{
						currentClass.companies.push({
							"id":item["id"],
							"company":item["company"],
							"function":item["function"],
							"keywords":item["keywords"]
						})
						cb1(null)
					},(err)=>{

						callback({
							callNext:false,
							message:companyDisambiguationMessageCreator(currentClass.companies),
							type:"companyDisambiguation"
						},callback)
					});	
				}

				else
				{
					currentClass.currentStage = "serviceFinder"
					currentClass.companies.push({
							"id":results[0]["id"],
							"company":results[0]["company"],
							"function":results[0]["function"],
							"keywords":results[0]["keywords"]
					})
					callback({callNext:true,message:"Comapny Found",type:"serviceDisambiguation"},callback)
				}
			})

		})

	}


	this.serviceFinder = function(currentClass,callback)
	{


		console.log("inside serviceFinder")
		callback({callNext:false,message:"Service Found",type:"serviceDisambiguation"},callback)



	}


}


//Send true or false in callback
function matchSynonyms(synonymArray,keywords,callback)
{
	let keywordArray = keywords.split(":")

	let ifFound = false

	for(i = 0;i<synonymArray.length ;i++)
	{
		for(j = 0;j<keywordArray.length;j++)
		{
			if(synonymArray[i] == keywordArray[j])
			{
				ifFound = true
				callback(true)
				break

			}
			if(ifFound)break
		}
	}
	if(!ifFound)callback(false)

}



function findAllSynonyms(allWords,callback){
	async.concat(allWords,(item,cb1)=>{
		nlParser.synonymParser(item,(err,arrayOfSynonyms)=>{
			cb1(null,arrayOfSynonyms)
		});
	},(err,results)=>{
		if(err) console.log(err)
		else 
		{
			callback(results)
		}
	})

}



function companyDisambiguationMessageCreator(companies){
	let arrayLength = companies.length
	let initString = "Is your query related to "
	initString = initString + companies[0]["function"]
	for (i = 1; i<companies.length-1;i++)
	{
		initString = initString +", "+ companies[i]["function"] 
	}
	initString = initString +" or "+ companies[arrayLength-1]["function"] +"?"

	return initString



}



module.exports = session
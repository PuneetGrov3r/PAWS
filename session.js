let async = require("async")
let pyInt = require("./pythonIntegrate")
let neo4jDriver = require('./neo4jDriver.js')

let nlParser = new pyInt.pythonIntegrate()
let paramDescription = require('./paramDescriptions.js')


function session(sessionId,latitude,longitude){

	let currentClass = this

	this.dbDriver  = new neo4jDriver()
	this.sessionId = sessionId
	this.latitude = latitude
	this.longitude = longitude
	
	this.words = {
		"verbs":[],
		"nouns":[],
		"adjectives":[],
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

	this.Services = []

	this.paramRequired = {}
	this.parameterBringFilled = {}


	this.currentFillingParameter = ""






	this.parseMessage = function(message,messageType,callback){
		this.mainCallback = callback
		switch (messageType) {
			case "initialQuery":
				nlParser.parseNV(message,(err,data)=>{

				//Assigning the the processed nouns and verbs to the object
				let dataObj = JSON.parse(data.slice(0,-1))
				currentClass.words["verbs"] = dataObj["Verb"]
				currentClass.words["nouns"] = dataObj["Noun"]
				currentClass.words["adjectives"] = dataObj["Adjective"]

				currentClass.words["allWords"] = dataObj["Verb"].concat(dataObj["Noun"]).concat(dataObj["Adjective"])
				let currentFunction = this[this.currentStage]
				
				//Finding all synonyms of verbs and nouns
				findAllSynonyms(this.words.allWords,(allSynonyms)=>{
					currentClass.words.allSynonyms = allSynonyms

						currentFunction(currentClass,(neo4jObject,prevCallback)=>{
							currentClass.prevCallback = prevCallback
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
				fuzzyCheckOptions(currentClass["companies"],message,"function",(isPresent,matchedObject)=>{
					console.log("isPresent", isPresent,matchedObject)
				})



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
								currentClass.mainCallback({
									callNext:false,
									message:companyDisambiguationMessageCreator(currentClass.companies),
									type:"companyDisambiguation"
								},callback)
							}
							else if(resultArray.length == 1)
							{
								currentClass.companies = resultArray
								currentClass.currentStage = "serviceFinder"
								currentClass["serviceFinder"](currentClass,currentClass.prevCallback)

							}
							else
							{
								currentClass.mainCallback({
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
						let allWords =   dataObj["Verb"].concat(dataObj["Noun"]).concat(dataObj["Adjective"])
						
						findAllSynonyms(allWords,(allSynonyms)=>{
							currentClass.nextStageSynonyms  = allSynonyms
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

									currentClass.mainCallback({
										callNext:false,
										message:companyDisambiguationMessageCreator(currentClass.companies),
										type:"companyDisambiguation"
									},callback)
								}
								else if(resultArray.length == 1)
								{
									currentClass.companies = resultArray
									currentClass.currentStage = "serviceFinder"
									currentClass["serviceFinder"](currentClass,currentClass.prevCallback)
								}
								else
								{
									currentClass.mainCallback({
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
				
				
				let isWord = message.split(" ").length<=1
				if(isWord)
				{
					findAllSynonyms([message],(allSynonyms)=>{
						async.filter(currentClass.Services,(item,cb1)=>{
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
								currentClass.Services = resultArray
								currentClass.mainCallback({
									callNext:false,
									message:serviceDisambiguationMessageCreator(currentClass.Services),
									type:"serviceDisambiguation"
								},callback)
							}
							else if(resultArray.length == 1)
							{
								currentClass.Services = resultArray
								currentClass.currentStage = "parameterFilling"
								currentClass["parameterFilling"](currentClass,currentClass.prevCallback)

							}
							else
							{
								currentClass.mainCallback({
									callNext:false,
									message:serviceDisambiguationMessageCreator(currentClass.Services),
									type:"serviceDisambiguation"
								},callback)

							}
						})
					})

				}
				else
				{
					nlParser.parseNV(message,(err,data)=>{
						let dataObj = JSON.parse(data.slice(0,-1))
						let allWords =   dataObj["Verb"].concat(dataObj["Noun"]).concat(dataObj["Adjective"])
						
						findAllSynonyms(allWords,(allSynonyms)=>{
							currentClass.nextStageSynonyms  = allSynonyms
							async.filter(currentClass.Services,(item,cb1)=>{
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
									currentClass.Services = resultArray

									currentClass.mainCallback({
										callNext:false,
										message:serviceDisambiguationMessageCreator(currentClass.Services),
										type:"serviceDisambiguation"
									},callback)								}
								else if(resultArray.length == 1)
								{
									currentClass.Services = resultArray
									currentClass.currentStage = "parameterFilling"
									currentClass["parameterFilling"](currentClass,currentClass.prevCallback)
								}
								else
								{
									currentClass.mainCallback({
										callNext:false,
										message:serviceDisambiguationMessageCreator(currentClass.Services),
										type:"serviceDisambiguation"
									},callback)

								}
							})
						})
					})

				}



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
				else currentClass.mainCallback({callNext:false,message:"Sorry we are unable to locate any appropriate service at this moment",type:"initialQuery"},callback)
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
					currentClass.mainCallback({callNext:false,message:"No service found",type:"initialQuery"},callback)

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

						currentClass.mainCallback({
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
					currentClass["serviceFinder"](currentClass,currentClass.prevCallback)
				}
			})

		})

	}






	this.serviceFinder = function(currentClass,callback)
	{


		console.log("inside serviceFinder")
		let companyName = currentClass.companies[0]["company"]
		currentClass.dbDriver.getLevel2Keywords(companyName,(arrayOfNodes)=>{

			console.log(arrayOfNodes)
			
			//Incase a company has only one service
			if(arrayOfNodes.length == 1)
			{
				currentClass.Services = [arrayOfNodes[0]]
				callback({callNext:true,message:"Service Found",type:"parameterFilling"},callback)
			}


			//If more than one node
			else {

				currentClass.Services = arrayOfNodes
				async.filter(arrayOfNodes,(item,cb1)=>{

				matchSynonyms(currentClass.words.allSynonyms.concat(currentClass.nextStageSynonyms),item["keywords"],(didMatch)=>{
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

				if(results.length == 0){
					currentClass.currentService = arrayOfNodes
					currentClass.mainCallback({callNext:false,
						message:serviceDisambiguationMessageCreator(currentClass.Services),
						type:"serviceDisambiguation"})
				}

				else if(results.length > 1)
				{
					console.log("this is called once")
					currentService = results
					currentClass.mainCallback({callNext:false,
						message:serviceDisambiguationMessageCreator(currentClass.Services),
						type:"serviceDisambiguation"})
				}

				else
				{
					console.log("this is called twice")
					currentClass.currentStage = "parameterFilling"
					currentClass.Services.push({
							"id":results[0]["id"],
							"company":results[0]["company"],
							"serviceName":results[0]["serviceName"],
							"keywords":results[0]["keywords"]
					})
					currentClass["parameterFilling"](currentClass,currentClass.prevCallback)
				}
			})


			}





		});



		


	}
	this.parameterFilling = function(currentClass,callback)
	{

		let apiCompany = currentClass["companies"][0]["company"]
		let apiServiceName = currentClass["Services"][0]["serviceName"]
		currentClass.paramRequired = paramDescription[apiCompany][apiServiceName]
		console.log(currentClass.paramRequired)





		currentClass.mainCallback({callNext:false,message:currentClass.Services[0]["serviceName"],type:"parameterFilling"})
	}

	this.getResult = function(){


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
			results.concat(allWords)
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

function serviceDisambiguationMessageCreator(services)
{
	let arrayLength = services.length
	let initString = "Do you require service according to "
	initString = initString + services[0]["serviceName"]
	for (i = 1; i<services.length-1;i++)
	{
		initString = initString +", "+ services[i]["serviceName"] 
	}
	initString = initString +" or "+ services[arrayLength-1]["serviceName"] +"?"

	return initString

	return currentClass.services[0]["serviceName"]
}



function fuzzyCheckOptions(nodeObjects,message,forName,callback){
	let arrayOfStrings = []
	async.each(nodeObjects,(item,cb1)=>{
		arrayOfStrings.push(item[forName])
		cb1(null)
	},(err)=>{
		if(err)console.log(err)
		else{
			nlParser.fuzzy([message,arrayOfStrings],(err,data)=>{
				
				console.log(data)
				
				

				
				callback(true,{})
			})

		}
	})



}

module.exports = session
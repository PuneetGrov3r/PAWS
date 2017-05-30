var request = require('request');
var async = require('async')
var prettyjson = require('prettyjson');

//Mapping the categories of bing news to available context
var categoryMappingObject = {
	"work":["Business"],
	"movies":["Entertainment"],
	"music":["Entertainment"],
	"living":["Health"],
	"politics":["Politics"],
	"tech":["ScienceAndTechnology"],
	"sports":["Sports"],
	"travel":["US/UK","World"]

}


//Main object to be imported
//The object is initialized with the api key
function BingNews(apiKey)
{
	this.apiKey = apiKey;
}

//Gets the news articles of a particular category
BingNews.prototype.categoryNews = function(searchObject,filter,callback)
{
	//REST api end point for getting category news
	var url = "https://api.cognitive.microsoft.com/bing/v5.0/news/";
	//Assigning the http request properties to an object
	var reqOpts = {
		url:url,
		headers:{
			"Ocp-Apim-Subscription-Key":this.apiKey
		},
		qs:
		{
			"category":searchObject["category"]
		},
		method:"GET"
	}
	//Http request is sent to the url
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else
		{
			//The result is parsed to a standard format for displaying to the frontend
			//console.log(body,"body");
			categoryNewsParser(body,function(result){	
				//console.log(result);
				callback(null,
				{
					"heading":"Category News for "+searchObject["category"],
					"value":result
				});
			});
		}
	});
}

//Search news articles
BingNews.prototype.searchNews = function(searchObject,filter,callback)
{
	//Checking if the required condition for filters are met
	if(searchObject['searchQuery'] == undefined)
	{
		callback(new Error("Search string not provided"),null);
		return;	
	}
	//The api end point for news search 
	var url = "https://api.cognitive.microsoft.com/bing/v5.0/news/search";
	//Assigning various properties to the http request
	var reqOpts = {
		url:url,
		headers:{
			"Ocp-Apim-Subscription-Key":this.apiKey
		},
		qs:
		{
			"q":searchObject["searchQuery"],
		},
		method:"GET"
	}
	if(searchObject["count"]!=undefined)reqOpts["qs"]["count"] = searchObject["count"];
	if(searchObject["offset"]!=undefined)reqOpts["qs"]["offset"] = searchObject["offset"];
	if(searchObject["market"]!=undefined)reqOpts["qs"]["mkt"] = searchObject["market"];
	if(searchObject["safeSearch"]!=undefined)reqOpts["qs"]["safeSearch"] = searchObject["safeSearch"];
	console.log(reqOpts);
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else
		{
			//The result is parsed to a standard format for displaying to the frontend
			categoryNewsParser(body,function(result){	
				callback(null,
				{
					"heading":"Search result for "+searchObject["searchQuery"],
					"value":result
				});
			});
		}
	});

}

//Function for displaying various categories to the users according to the context chosen
BingNews.prototype.subFunctionContextToCategory = function(object,filter,callback)
{
	var contextArr = object.context.split('_');
	var resultArray = [];
	var result = [];
	async.each(contextArr,function(item1,cb){
		if(item1 in categoryMappingObject)
		{
			for(j in categoryMappingObject[item1])
			{
				if(resultArray.indexOf(categoryMappingObject[item1][j])<0)
				{
					resultArray.push(categoryMappingObject[item1][j]);
				}
			}
			cb();
		}
		else cb();
	},function(err){
		if(err)console.log(err);
		else
		{
			//Each result is sent to the frontend as a key value pair
			async.each(resultArray,function(item2,cb){
				result.push({"id":item2,"name":item2});
				cb();
			},function(err){
				if(err)console.log(err);
				else callback(null,result);
			});
		}
	});
}

//Function for parsing the results so that it can be displayed in the frontend in a standard format
function categoryNewsParser(body,callback)
{
	var obj = JSON.parse(body);
	var result = [];
	async.each(obj["value"],function(item,cb){
		var newsObj = {
			"name":item["name"],
			"url":item["url"],
			"description":item["description"]
		}
		if(item["image"])
		{
			newsObj["image_small"] = item["image"]["thumbnail"]["contentUrl"];
		}
		result.push(newsObj);
		cb();


	},function(err){
		if(err)console.log(err);
		else callback(result); 
	})

}


module.exports = BingNews;

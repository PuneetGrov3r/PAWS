//Imported the request Module
var request = require('request');
var async = require('async');
//var utilityFunctions = require('./utilityFunctions.js');
var productFeedListing = {};
var categoryMapping ={
	"food":["food_nutrition"],
	"tech":["televisions","desktops","audio_players","laptops","wearable_smart_devices","cameras","computer_peripherals","tablets","mobile_accessories","camera_accessories","laptop_accessories","computer_components","mobiles","video_players","landline_phones","tv_video_accessories","software","computer_storage","network_components"],
	"shopping":["food_nutrition", "televisions", "landline_phones", "tv_video_accessories", "software", "computer_storage", "fragrances", "network_components", "e_learning", "video_players", "mens_clothing", "music_movies_posters", "furniture", "bags_wallets_belts", "mobiles", "kids_clothing", "kids_footwear", "pet_supplies", "mens_footwear", "air_coolers", "home_entertainment", "watches", "sunglasses", "eyewear", "computer_components", "laptop_accessories", "womens_clothing", "mobile_accessories", "camera_accessories", "air_conditioners", "luggage_travel", "automotive", "tablets", "refrigerator", "home_improvement_tools", "computer_peripherals", "stationery_office_supplies", "sports_fitness", "baby_care", "cameras", "wearable_smart_devices", "audio_players", "grooming_beauty_wellness", "tablet_accessories", "kitchen_appliances", "microwave_ovens", "laptops", "washing_machine", "gaming", "toys", "home_appliances", "home_decor_and_festive_needs", "home_and_kitchen_needs", "jewellery", "home_furnishing", "desktops", "womens_footwear", "household_supplies"],
	"home":["landline_phones","household_supplies","home_furnishing","home_and_kitchen_needs","home_decor_and_festive_needs","home_appliances","washing_machine","microwave_ovens","kitchen_appliances","home_improvement_tools","refrigerator","tv_video_accessories","video_players","furniture","pet_supplies","air_coolers","home_entertainment","air_conditioners"],
	"work":["software","desktops","stationery_office_supplies","computer_peripherals","computer_components","computer_storage","network_components",],
	"beauty":["fragrances"],
	"education":["e_learning"],
	"fashion":["mens_clothing","womens_footwear","jewellery","tablet_accessories","grooming_beauty_wellness","camera_accessories","mobile_accessories","womens_clothing","watches","sunglasses","eyewear","bags_wallets_belts","kids_clothing","kids_footwear","mens_footwear","laptop_accessories"],
	"movies":["music_movies_posters"],
	"music":["music_movies_posters","audio_players"],
	"travel":["bags_wallets_belts","luggage_travel"],
	"motoring":["automotive"],
	"sports":["sports_fitness"],
	"health":["wearable_smart_devices","sports_fitness"],
	"games":["gaming","toys"]
};


function Flipkart(){}


function categoryProcessor(item,callback)
{
	var categoryObj = {
		name:item['apiName'],
		get:item['availableVariants']['v1.1.0']['get'],
		deltaGet:item['availableVariants']['v1.1.0']['deltaGet'],
		top:item['availableVariants']['v1.1.0']['top']
	};

	callback(null,categoryObj);

}



//Use this Function to get a list of all categories
//It returns a list of object having name,feed url and delta field url
//Delta field url is used to generate a list of small number of frequently changing items

Flipkart.prototype.getAllCategories = function(opts,callback)
{
	reqOpts= {
		url : "https://affiliate-api.flipkart.net/affiliate/api/"+opts.affId+".json",	
		method : "GET",
		headers:{
			"Fk-Affiliate-Id":opts.affId,
			"Fk-Affiliate-Token":opts.affToken
		}
	}
	console.log(reqOpts);
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else
		{
			async.map(JSON.parse(body)['apiGroups']['affiliate']['apiListings'],categoryProcessor,
				function(err,result){
					if(err)console.log(err);
					else callback(null,result);
			});
		}

	});

}
Flipkart.prototype.getThisCategoryLink = function(opts,callback)
{
	if(opts['category']==undefined)
	{
		callback(new Error("Category not provided"),null);
		return;
	}
	else var category = opts['category'];
	reqOpts= {
		url : "https://affiliate-api.flipkart.net/affiliate/api/"+this.affId+".json",	
		method : "GET"
	}
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else
		{
			async.detect(JSON.parse(body)['apiGroups']['affiliate']['apiListings']
				,function(item,cb){
					if(item['apiName']==category)cb(null,true);
					else cb(null,false);
				},function(err,result){
					if(err)console.log(err);
					if(result==undefined)
					{
						callback(new Error("Category not matching"),null);
						return;
					}
					else 
					{
						callback(null,{	name:result['apiName'],
										get:result['availableVariants']['v1.1.0']['get'],
										deltaGet:result['availableVariants']['v1.1.0']['deltaGet']
									});
					}
			});
		}

	});
}
Flipkart.prototype.searchProduct = function(searchObject,filter,callback)
{
	let affId = 'rvarunweb'
	let affToken = '8a60ea55b5ce4fd6ae895b843c754180'
	var url="https://affiliate-api.flipkart.net/affiliate/1.0/search.json";
	var reqOpts= {
		url : url,	
		headers:{
			"Fk-Affiliate-Id":affId,
			"Fk-Affiliate-Token":affToken
		},
		qs:{
			query:searchObject['searchQuery'],
			resultCount:10
		},
		method : "GET"
	}
	console.log(url);
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else 
		{
			parseFlipkartResult(body,searchObject["searchQuery"],function(arrayOfProducts,resultsFor){
				callback(null,{
					"heading":"Search Results for "+resultsFor,
					"value":arrayOfProducts
				});
			});
		}
	});
}

Flipkart.prototype.searchProduct1 = function(searchObject,filter,callback)
{
	var url="https://affiliate-api.flipkart.net/affiliate/1.0/search.json";
	var reqOpts= {
		url : url,	
		headers:{
			"Fk-Affiliate-Id":this.affId,
			"Fk-Affiliate-Token":this.affToken
		},
		qs:{
			query:searchObject['searchQuery'],
			resultCount:10
		},
		method : "GET"
	}
	if(searchObject['gender'])reqOpts["qs"]["query"] = searchObject['gender']+reqOpts["qs"]["query"] ;
	console.log(url);
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else 
		{
			parseFlipkartResult(body,searchObject["searchQuery"],function(arrayOfProducts,resultsFor){
				callback(null,{
					"heading":"Search Results for "+resultsFor,
					"value":arrayOfProducts
				});
			});
		}
	});
}

Flipkart.prototype.searchProduct2 = function(searchObject,filter,callback)
{
	var url="https://affiliate-api.flipkart.net/affiliate/1.0/search.json";
	var reqOpts= {
		url : url,	
		headers:{
			"Fk-Affiliate-Id":this.affId,
			"Fk-Affiliate-Token":this.affToken
		},
		qs:{
			query:searchObject['searchQuery'],
			resultCount:10
		},
		method : "GET"
	}
	if(searchObject['gender'])reqOpts["qs"]["query"] = searchObject['gender']+reqOpts["qs"]["query"] ;
	console.log(url);
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else 
		{
			parseFlipkartResult(body,searchObject["searchQuery"],function(arrayOfProducts,resultsFor){
				callback(null,{
					"heading":"Search Results for "+resultsFor,
					"value":arrayOfProducts
				});
			});
		}
	});
}


Flipkart.prototype.getTopProducts = function(searchObject,filter,callback)
{
	var url = productFeedListing[searchObject["category"]]["top"];
	var reqOpts = {
		url:url,
		headers:{
			"Fk-Affiliate-Id":this.affId,
			"Fk-Affiliate-Token":this.affToken
		},
		method:"GET"
	}
	request(reqOpts,function(err,response,body){
		if(err)callback(err,null);
		else 
		{
			parseFlipkartResult(body,searchObject["category"],function(arrayOfProducts){
				callback(null,{
					"heading":"Top Products for "+searchObject["category"],
					"value":arrayOfProducts
				});
			});
		}
	});
}



Flipkart.prototype.getDeltaFeed = function(opts,callback)
{
	if(opts['link']==undefined)
	{
		callback(new Error("No link provided"),null)
		return;
	}



}
Flipkart.prototype.subFunctionCategoryMapping = function(object,filter,callback)
{
	var contextArray = object.context.split('_');
	var resultArray = [];
	var result = [];
	var getAllCategoriesFunction = this.getAllCategories;
	var affId = this.affId;
	var affToken = this.affToken;
	//console.log(this.affId);
	async.parallel([
	function(cb1){
		getAllCategoriesFunction({affId:affId,affToken:affToken},function(err,productFeedListingArray){
			async.each(productFeedListingArray,function(item2,cb2){
				productFeedListing[item2["name"]] = {
					"get":item2["get"],
					"deltaGet":item2["deltaGet"],
					"top":item2["top"]
				}
				cb2();
			},function(err){
				if(err)console.log(err);
				else cb1(null);
			});
		});
	},function(cb1){
		async.each(contextArray,function(item2,cb2){
			async.each(categoryMapping[item2],function(item3,cb3){
				if(resultArray.indexOf(item3)<0)
				{
					resultArray.push(item3);
				}
				cb3();
			},function(err){
				if(err)console.log(err);
				else cb2();
			});
		},function(err){
			if(err)console.log(err);
			else {
				async.each(resultArray,function(item2,cb2){
					result.push({"name":item2,"id":item2});
					cb2();
				},
				function(err){
						if(err)console.log(err);
						else cb1();
				});
			}
		});
	}],function(err,results){
		if(err)console.log(err);
		else callback(null,result);
	});

}

/*
function parseFlipkartResult(jsonString,resultsFor,cb)
{
	//console.log(jsonString);
	var jsonObject = JSON.parse(jsonString);
	var resultObj = {};
	var arrayOfProducts = [];
	async.each(jsonObject["productInfoList"],function(item,callback){
		var fullProductInfo = item["productBaseInfoV1"];
		var costString = '\nFlipkart Price : '+fullProductInfo["flipkartSellingPrice"]['amount'].toString()+' INR\nMRP : '+fullProductInfo["maximumRetailPrice"]['amount'].toString()+' INR';
		var temp = {
			name : fullProductInfo["title"],
			image_small : fullProductInfo["imageUrls"]["200x200"],
			image_large :fullProductInfo["imageUrls"]["400x400"],
			cost : costString,
			description:fullProductInfo["productDescription"],
			url : fullProductInfo["productUrl"],
			brand: fullProductInfo["productBrand"],
			category:fullProductInfo["categoryPath"]
		};
		utilityFunctions.stringShortner({"string":temp["description"],"charLimit":147,"appendString":"..."},function(err,result){
			if(err)console.log(err);
			temp["description"] = result;
			arrayOfProducts.push(temp);
			callback();
		});
		
	},function(err){
		if(err)console.log(err);
		else cb(arrayOfProducts,resultsFor);
	});
}
*/



module.exports = Flipkart



var a = new Flipkart()
a.searchProduct({'searchQuery': 'moto x play'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
//Node version 6.x or above required

const request = require('request');
const co = require('co');
const fs = require('fs');
const async = require('async');

const Extras = () => ({
	appendObject: (obj, name) => {
		//if(name === 'undefined') return;
		var bool = fs.exists('./JSON/' + name + '.json');
		if(bool){
			let p = new Promise((resolve, reject) => {
				resolve(fs.readFile('./JSON/' + name + '.json'));
			});
			p.then( (file) => {
				return JSON.parse(file);
			})
			.then( (json) => {
				return json.data.push(obj);
			})
			.then( (json) => {
				return JSON.stringify(json);
			})
			.then( (write) => {
				fs.writeFile('./JSON/' + name + '.json', write);
			});
			 	
		}else{
			let p1 = new Promise((resolve, reject) => {
				resolve({data:[]}.data.push(obj));
			});
			p1.then( (obj) => {
				return JSON.stringify(obj);
			})
			.then( (write) => {
				fs.writeFile('./JSON/' + name + '.json', write);
			})
			
		}
	}

})



const Common = () => ({


	categories: (callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url = state.url + '/categories';
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					data['categories'].forEach((element) => {
						console.log(element['categories']);
					});
				})
				.catch( (error) => {
					callback(error, null);
				});
				
			}
		})
	},

	cities: (more = {q:'delhi', lat:'', lon:'', city_ids:'', count:'5'}, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//   more = {
		//				q: q,                 // query by city name
		//				lat: lat,
		//				lon: lon,
		//				city_ids: city_ids,   // '1,2,3,4,5'
		//				count: count
		//   }
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/cities';
		let temp =  '?q=' + more.q;
		if(more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon.length !== 0) temp += '&lon=' + more.lon;	
		if(more.city_ids.length !== 0) temp += '&city_ids=' + more.city_ids;
		temp += '&count=' + more.count;

		state.url += temp;
		
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					data['location_suggestions'].forEach((element) => {
						console.log('city_id: ' + element['id']);
						console.log('   country_id : ' + element['country_id'])
						console.log('   name: ' + element['name']);
					});
				})
				.catch( (error) => {
					callback(error, null);
				});
			}
		})
	},

	collections: (more = {city_id:'1', lat:'', lon:'', count:'10'}, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//   more = {
		//				city_id: city_id,
		//				lat: lat,
		//				lon: lon,
		//				count: count
		//   }
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/collections';
		let temp = '?city_id=' + more.city_id;
		if(more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon.length !== 0) temp += '&lon=' + more.lon;
		temp += '&count=' + more.count;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					data['collections'].forEach((element) => {
						//console.log(element);
						console.log('Type: ' + element['collection']['title'] + ' (id:' + element['collection']['collection_id'] + ')');
						console.log('   Description : ' + element['collection']['description'])
						console.log('   No. of Restaurants: ' + element['collection']['res_count']);
					});
				})
				.catch( (error) => {
					callback(error, null);
				});
				
			}
		})
	},

	cuisines: (more = {city_id:'1', lat:'', lon:''}, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//   more = {
		//				city_id: city_id,
		//				lat: lat,
		//				lon: lon,
		//   }
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/cuisines';
		let temp = '?city_id=' + more.city_id;
		if(more.lat && more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon && more.lon.length !== 0) temp += '&lon=' + more.lon;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					callback(null, data['cuisines']);
				})
				.catch( (error) => {
					callback(error, null);
				});
			}else{
				console.log(data);
				callback(err, null);
			}
		})
	},

	establishments: (more = {city_id:'1', lat:'', lon:'', count:''}, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//   more = {
		//				city_id: city_id,
		//				lat: lat,
		//				lon: lon,
		//   }
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/establishments';
		let temp = '?city_id=' + more.city_id;
		if(more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon.length !== 0) temp += '&lon=' + more.lon;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					data['establishments'].forEach((element) => {
						console.log(element['establishment']['name'] + ' (id: ' + element['establishment']['id'] + ')');
					});
				})
				.catch( (error) => {
					callback(error, null);
				});
			}
		})
	},

	geocode: (more = {lat:'28.6118815', lon:'77.0345796'}, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//   more = {
		//				lat: lat,
		//				lon: lon,
		//   }
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/geocode';

		let temp = '?lat=' + more.lat;
		temp += '&lon=' + more.lon;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					console.log(element['link']);
					console.log('Location : ' + element['location']['title']);
					console.log('Popularity: ' + element['popularity']['popularity'] + ',  NightLifeIndex: ' + element['popularity']['nightlife_index']);
					console.log('Top Cuisines:')
					element['popularity']['top_cuisines'].forEach((el) => {
						console.log('    ' + el);
					});
					console.log('Nearby Restaurants:');
					element['nearby_restaurants'].forEach((res) => {
						console.log('    ' + res['restaurant']['name'] + ' (id: ' + res['restaurant']['R']['res_id'] + ')');
						console.log('        ' + '{' + res['restaurant']['location']['address'] + '}');
						console.log('        ' + res['restaurant']['cuisines']);
						console.log('        Avg Cost for 2: '+ res['restaurant']['currency'] + res['restaurant']['average_cost_for_two'] + ' (Price Range: ' + res['restaurant']['price_range'] + ')');
						//  
						//   res['restaurant']['menu_url']
						//   res['restaurant']['has_online_delivery']
						//   res['restaurant']['is_delivering_now']
						//   res['restaurant']['order_url']
						//   res['restaurant']['has_table_booking']
						//   res['restaurant']['book_url']
						//   res['restaurant']['events_url']
						//
					});
				})
				.catch( (error) => {
					callback(error, null);
				});
				

			}
		})
	},

});



const Restaurant = () => ({
	
	dailymenu: (res_id = '-9999', callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		if(res_id === '-9999'){
			console.log('You need to provide "res_id" as argument...');
			return;
		}
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/dailymenu?res_id=' + res_id;
		console.log('Is it working or not?');

		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					console.log(data);
				})
				.catch( (error) => {
					callback(error, null);
				});
			}
		});
	},

	restaurant: (res_id = '-9999', callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		if(res_id === '-9999'){
			console.log('You need to provide "res_id" as argument...');
			return;
		}
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/restaurant?res_id=' + res_id;

		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
					let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					console.log(data['name']);
					console.log('{' + data['location']['address'] + '}');
					console.log('Cuisines: ' + data['cuisines']);
					console.log('Avg. for two: ' + data['currency'] + data['average_cost_for_two'] + ' (Price Range: ' + data['price_range'] + ')');
					//
					//	data['menu_url']
					//	data['has_online_delivery']
					//	data['is_delivering_now']
					//	data['events_url']
					//	data['user_rating']['aggregate_rating']
					//	data['has_table_booking']
					//
				})
				.catch( (error) => {
					callback(error, null);
				});

				
			}
		});
	},

	reviews: (more = {res_id: '-9999', start: '', count: ''}, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//
		//	more = {
		//		res_id: res_id
		//		start: start     // starting index of reviews {5 shown}
		//		count: count
		//	}
		//
		if(more.res_id === '-9999'){
			console.log('You need to provide "res_id" as argument...');
			return;
		}
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/reviews';
		let temp = '?res_id=' + more.res_id;
		if(more.start && (more.start.length !== 0)) temp += '&start=' + more.start;
		if(more.count && (more.count.length !== 0)) temp += '&count=' + more.count;
		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){

				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});

				p.then((data) => {
					console.log("Reviews count: " + data['reviews_count']);
					data['user_reviews'].forEach( (review) => {
						let rev = review['review'];
						console.log(rev['user']['name']);
						console.log('    {Foodie Level:' + rev['user']['foodie_level'] + ' (level: ' + rev['user']['foodie_level_num'] + ')}');
						console.log('    Rating: ' + rev['rating'] + ' (' + rev['review_time_friendly'] + ')');
						console.log('    "' + rev['review_text'] + '"');

					})

				})
				.catch((err) => {
					console.log('Error: "'+ err +'"');
				})
			}
		});
	},

	search: (more = { entity_id : '1', entity_type : 'city', q : '',
						start : '0', count : '10', lat : '28.592140',
						lon : '77.046051', radius : '50000', cuisines : '148, 85, 40, 82', establishment_type : '16, 21, 1',
						collection_id : '', category : '1, 2', sort : 'real_distance', order : 'desc' }, callback) => {
		//
		//	more = {
		//		entity_id = '',				// entity_id = location id
		//		entity_type = '',			// location type
		//		q = 'night',						// q = search keyword
		//		start = '',					// fetch results after offset
		//		count = '',					// count = max number of results to display
		//		lat = '28',					//
		//		lon = '77',					//
		//		radius = '50000',				// redius = radius around (lat,lon); to define search area, defined in meters(M)
		//		cuisines = '',				// cuisines = list of 'cuisine id's' separated by comma
		//		establishment_type = '',	// 'estblishment id' obtained from establishments call
		//		collection_id = '',			// 'collection id' obtained from collections call
		//		category = '',				// 'category ids' obtained from categories call
		//		sort = '',					// cost or rating or real_distance
		//		order = ''					// asc or desc
		//	}
		//
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		const key = '8c566e4798eca2737581bd3c21390711'
		state.headers['user-key'] = key;
		state.url += '/search?';
		let temp = '';
		//if(more.q && more.q.length !== 0) temp += 'q=' + more.q;
		//if(more.entity_id && more.entity_id.length !== 0) temp += '&entity_id=' + more.entity_id;
		temp += 'entity_id=1&entity_type=city&start=0&count=10&radius=50000&cuisines=148,85,40,82&establishment_type=16,21,1&category=1,2&sort=rating&order=desc'
		//if(more.entity_type && more.entity_type.length !== 0) temp += '&entity_type=' + more.entity_type;
		//if(more.start && more.start.length !== 0) temp += '&start=' + more.start;
		//if(more.count && more.count.length !== 0) temp += '&count=' + more.count;
		if(more.lat && more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon && more.lon.length !== 0) temp += '&lon=' + more.lon;
		//if(more.radius && more.radius.length !== 0) temp += '&radius=' + more.radius;
		//if(more.cuisines && more.cuisines.length !== 0) temp += '&cuisines=' + more.cuisines;
		//if(more.establishment_type && more.establishment_type.length !== 0) temp += '&establishment_type=' + more.establishment_type;
		//if(more.collection_id && more.collection_id.length !== 0) temp += '&collection_id=' + more.collection_id;
		//if(more.category && more.category.length !== 0) temp += '&category=' + more.category;
		//if(more.sort && more.sort.length !== 0) temp += '&sort=' + more.sort;
		//if(more.order && more.order.length !== 0) temp += '&order=' + more.order;
		state.url += temp;
		let out = []
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then((data) => {
					
					async.each(data['restaurants'], (item, cb) =>{
						//console.log(item)
						let res_id = item['restaurant']['R']['res_id']
						let state = {
							url:"https://developers.zomato.com/api/v2.1",
							method:'GET',
							headers:{
								'user-key': ''
							},
						};
						state.headers['user-key'] = key;
						state.url += '/restaurant?res_id=' + res_id;

						request(state, (err, res, body) => {
							if(!err && res.statusCode === 200){
								let p = new Promise((resolve, reject) => {
									resolve(JSON.parse(body));
								});
								p.then( (data) => {
									let o = {}
									o['image_url'] = data['thumb']
									o['title'] = data['name']
									o['address'] = data['location']['address']
									o['rating'] = data['user_rating']['aggregate_rating']
									o['costForTwo'] = data['currency'] + ' ' + data['average_cost_for_two']
									o['url'] = data['url']
									out.push(o)
									cb(null)
									//console.log(data['name']);
									//console.log('{' + data['location']['address'] + '}');
									//console.log('Cuisines: ' + data['cuisines']);
									//console.log('Avg. for two: ' + data['currency'] + data['average_cost_for_two'] + ' (Price Range: ' + data['price_range'] + ')');
									//
									//	data['menu_url']
									//	data['has_online_delivery']
									//	data['is_delivering_now']
									//	data['events_url']
									//	data['user_rating']['aggregate_rating']
									//	data['has_table_booking']
									//
								})
								.catch( (error) => {
									callback(error, null);
								});

								
							}
						});





					}, (err) => {
						if(!err){
							callback(null, out)
						}else{
							console.log(err)
						}
					})
					//console.log(data);
					//console.log(data['restaurants'][0]);
					//data['restaurants'].forEach( (d, i) => {
					//	if(i>2) return
					//	let o = {};
					//	d = d['restaurant'];
					//	o['res_id'] = d['R']['res_id'];
					//	o['name'] = d['name'];
					//	//o['establishment_types'] = d['establishment_types'];
					//	//console.log(o);
					//	//Extras().appendObject(o, d['cuisines'].split(', ')[0]); 
					//});
					//console.log('Results Found: ' + data['results_found']);
					// data['results_shown']
					//
					//
					//callback(null, [data['restaurants'], more.cuisines]);
					//
					//
					//data['restaurants'].forEach((restaurant) => {
					//	let res = restaurant['restaurant'];
					//	console.log(res['name']);
					//	console.log(res['location']['address']);
					//	// res['location']['city']
					//	// res['location']['city_id']
					//	// res['location']['latitude']
					//	// res['location']['country_id']
					//	// res['locality']['zipcode']
					//	console.log(res['cuisines']);
					//	console.log(res['currency'] + res['average_cost_for_two'] + ' (' + res['price_range'] + ')');
					//	console.log(res['offers']);
					//	console.log(res['user_rating']['aggregate_rating']);
					//	console.log(res['menu_url']);
					//	console.log(res['has_online_delivery']);
					//	console.log(res['is_delivering_now']);
					//	console.log(res['order_url']);
					//	console.log(res['has_table_booking']);
					//	console.log(res['events_url']);
					//	console.log(res['establishment_types'])
					//});
				})
				.catch((err) => {
					console.log('Error : ' + err);
				})
			}
		});
	}
});




const Location = (state) => ({

	locations: (more = { query : 'delhi', lat: '', lon: '', count: '5'}, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//
		//	more = {
		//		query : query,			//suggestion for location name
		//		lat: lat,			
		//		lon: lon,			
		//		count: count 			//max number of results to fetch
		//	}
		//
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url += '/locations';
		let temp = '?query=' + more.query;
		if(more.lat && more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon && more.lon.length !== 0) temp += '&lon=' + more.lon;
		if(more.count && more.count.length !== 0) temp += '&count=' + more.count;
		state.url += temp;

		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200 ){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then((data) => {
					data['location_suggestions'].forEach( (el) => {
						console.log(el['entity_type']);
						console.log(el['entity_id']);
						console.log(el['title']);
						console.log(el['latitude']);
						console.log(el['city_id']);
						console.log(el['city_name']);
						console.log(el['country_id']);
						console.log(el['country_name']);
					});

				})
				.catch((err) => {
					console.log('Error: ' + err);
				})
			}
		});
	},

	location_details: (more = { entity_id: '793', entity_type: 'group' }, callback) => {
		const key = '8c566e4798eca2737581bd3c21390711'
		//
		//	more = {
		//		entity_id: entity_id		//location id obtained from locations api
		//		entity_type: entity_type	//location type obtained from locations api
		//	}
		//
		let state = {
			url:"https://developers.zomato.com/api/v2.1",
			method:'GET',
			headers:{
				'user-key': ''
			},
		};
		state.headers['user-key'] = key;
		state.url +='/location_details';
		let temp = '?entity_id=' + more.entity_id;
		temp += '&entity_type=' + entity_type;

		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200 ){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then((data) => {
					console.log(data['popularity']);
					console.log(data['nightlife_index']);
					data['nearby_res'].forEach( (el) => {
						console.log(el);
					});
					data['top_cuisines'].forEach((el) => {
						console.log(el);
					});
					console.log(data['subzone']);
					console.log(data['subzone_id']);
					console.log(data['city']);
					console.log(data['location']);
					console.log(data['num_restaurant']);
					data['best_rated_restaurant'].forEach((restaurant) => {
						let res = restaurant['restaurant'];
						console.log(res);
					});
				})
				.catch((err) => {
					console.log('Error: ' + err);
				});

			}
		});
	}
});







const cuisines = {'burger': '168', 'cafe':'30', 'bbq':'193', 'bakery':'5', 'beverages':'270', 'biryani':'7', 'chinese':'25', 'continental':'35', 'fast food': '40',
					'french':'45', 'grill':'181', 'hydrabadi':'49', 'ice creame': '233', 'indian': '148', 'pizza': '82', 'sandwich': '304', 'seafood':'83', 'south indian': '85',
					'tea': '163', 'vegetarian':'308', 'italian':'55', 'japanese':'60', 'juices':'164', 'mithai':'1015', 'street food': '90'
}

const categories = {
	'delivery':'1', 'dine out':'2','nightlife':'3','catchingup':'4', 'take away':'5', 'cafes':'6', 'daily menus':'7',  'breakfast':'8', 'lunch':'9', 'dinner':'10', 'clubs lounges':'14',
	'bar pubs':'11', 'pocket friendly':'13'
}

const establishments ={
	'casual dining':'16', 'fine dining': '18', 'quick bites':'21', 'food court':'20', 'dessert parlour':'23', 'cafe':'1', 'dhaba':'61', 'club':'8', 'bar':'7',
	'bakery':'31', 'cocktail':'272', 'wine bar': '278', 'pub': '6', 'butcher shop': '291'
}

const estdict = {
	'casual dining':{
		'cuisines' : ['north indian', 'chinese', 'continental', 'italian', 'south indian', 'fast food', 'thai'],
		'categories' : ['delivery', 'dine out', 'drinks', 'cafe']
	},
	'fine dining':{
		'cuisines' : ['north indian', 'continental', 'chinese', 'italian', 'european'],
		'categories' : ['dine out']
	},
	'club':{
		'cuisines' : ['finger food', 'chinese', 'north indian'],
		'categories' : ['drink', 'nightlife']
	},/*
	'quick bites':{
		'cuisines' : ['north indian', 'fast food', 'chinese', 'south indian', 'street food', 'burger'],
		'categories' : ['delivery', 'dine out']
	}*/
	'cafe':{
		'cuisines' : ['cafe', 'fast food', 'italian', 'continental'],
		'categories': ['delivery', 'dine out']
	},
	'dhaba' :{
		'cuisines' :['north indian'],
		'categories' : ['delivery', 'dine out']
	},
	'bar' :{
		'cuisines':['dine out', 'drinks', 'night life'],
		'categories': ['north indian', 'chinese', 'continental']
	},
	'dessert parlour': {
		'cuisones': ['ice cream'],
		'categories':[]
	},
	'quick bites': {
		'cuisines': ['fast food', 'burger', 'pizza', 'bakery'],
		'category': ['delivery', 'dine out']
	}
}
const cuidict = {

}
/*
const Custom = () => ({
	byCuisine: ( more = {'cuisine': ''}, callback) => {
		let estab = 
		Restaurant().search({ entity_id : '0', entity_type : '', q : '',
						start : '', count : '', lat : '28',
						lon : '77', radius : '50000', cuisines : '', establishment_type : '',
						collection_id : '', category : '', sort : 'rating', order : 'desc' })
	}
});

*/


module.exports = Restaurant;
/*


Common('8c566e4798eca2737581bd3c21390711').cuisines(more = {city_id:'1', lat:'', lon:''}, (err, data) => {
	if(!error){
		data.forEach( (cui, count) => {
			console.log(cui);
		});
	}else{
		console.log(err);
	}
});

*/
/*
Restaurant().search({ entity_id : '1', entity_type : 'city', q : '',
						start : '0', count : '10', lat : '28.592140',
						lon : '77.046051', radius : '50000', cuisines : '148, 85, 40, 82', establishment_type : '16, 21, 1',
						collection_id : '', category : '1, 2', sort : 'real_distance', order : 'desc' });

*/
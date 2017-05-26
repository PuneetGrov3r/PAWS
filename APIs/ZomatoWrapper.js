//Node version 6.x or above required

const request = require('request');
const co = require('co');
const fs = require('fs');

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



const Common = (key) => ({

	categories: (callback) => {
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
			}
		})
	},

	establishments: (more = {city_id:'1', lat:'', lon:'', count:''}, callback) => {
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



const Restaurant = (key) => ({
	
	dailymenu: (res_id = '-9999', callback) => {
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

	search: (more = { entity_id : '', entity_type : '', q : 'night', start : '', count : '', lat : '28', 
						lon : '77', radius : '50000', cuisines : '', establishment_type : '',
						 collection_id : '', category : '', sort : '', order : '' }, callback) => {
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
		state.headers['user-key'] = key;
		state.url += '/search?';
		let temp = '';
		if(more.q && more.q.length !== 0) temp += 'q=' + more.q;
		if(more.entity_id && more.entity_id.length !== 0) temp += '&entity_id=' + more.entity_id;
		if(more.entity_type && more.entity_type.length !== 0) temp += '&entity_type=' + more.entity_type;
		if(more.start && more.start.length !== 0) temp += '&start=' + more.start;
		if(more.count && more.count.length !== 0) temp += '&count=' + more.count;
		if(more.lat && more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon && more.lon.length !== 0) temp += '&lon=' + more.lon;
		if(more.radius && more.radius.length !== 0) temp += '&radius=' + more.radius;
		if(more.cuisines && more.cuisines.length !== 0) temp += '&cuisines=' + more.cuisines;
		if(more.establishment_type && more.establishment_type.length !== 0) temp += '&establishment_type=' + more.establishment_type;
		if(more.collection_id && more.collection_id.length !== 0) temp += '&collection_id=' + more.collection_id;
		if(more.category && more.category.length !== 0) temp += '&category=' + more.category;
		if(more.sort && more.sort.length !== 0) temp += '&sort=' + more.sort;
		if(more.order && more.order.length !== 0) temp += '&order=' + more.order;
		state.url += temp;

		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then((data) => {
					
					//console.log(data);
					//console.log(data['restaurants'][0]);
					data['restaurants'].forEach( (d) => {
						let o = {};
						d = d['restaurant'];
						o['res_id'] = d['R']['res_id'];
						o['name'] = d['name'];
						//o['establishment_types'] = d['establishment_types'];
						//console.log(o);
						Extras().appendObject(o, d['cuisines'].split(', ')[0]); 
					});
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





const Custom = (key) => ({

	fetchByRestName: (name, callback) => {
	}
});

Common('8c566e4798eca2737581bd3c21390711').cuisines(more = {city_id:'1', lat:'', lon:''}, (err, data) => {
	data.forEach( (cui, count) => {
		//console.log(cui);
		Restaurant('8c566e4798eca2737581bd3c21390711').search({ entity_id : '', entity_type : '', q : '',
						start : '', count : '', lat : '28.6118815',
						lon : '77.0345796', radius : '10000', cuisines : cui['cuisine']['cuisine_id'], establishment_type : '',
						collection_id : '', category : '', sort : 'rating', order : 'desc' });
	});
});



Restaurant('8c566e4798eca2737581bd3c21390711').search({ entity_id : '0', entity_type : '', q : '',
						start : '', count : '', lat : '28',
						lon : '77', radius : '50000', cuisines : '', establishment_type : '',
						collection_id : '', category : '', sort : 'rating', order : 'desc' });


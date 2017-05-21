'use strict'

//Node version 6.x or above required

const request = require('request');

const url = "https://developers.zomato.com/api/v2.1";
let state = {
	url:url,
	method:'GET',
	headers:{
		'user-key': '8c566e4798eca2737581bd3c21390711'
	},
}


const Common = (state) => ({

	categories: () => {
		state.url = state.url + '/categories';
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let data = JSON.parse(body);
				data['categories'].forEach((element) => {
					console.log(element['categories']);
				})
			}
		})
	},

	cities: (more = {q:'delhi', lat:'', lon:'', city_ids:'', count:'5'}) => {
		//   more = {
		//				q: q,                 // query by city name
		//				lat: lat,
		//				lon: lon,
		//				city_ids: city_ids,   // '1,2,3,4,5'
		//				count: count
		//   }
		state.url += '/cities';
		let temp =  '?q=' + more.q;
		if(more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon.length !== 0) temp += '&lon=' + more.lon;	
		if(more.city_ids.length !== 0) temp += '&city_ids=' + more.city_ids;
		temp += '&count=' + more.count;

		state.url += temp;
		
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let data = JSON.parse(body);
				data['location_suggestions'].forEach((element) => {
					console.log('city_id: ' + element['id']);
					console.log('   country_id : ' + element['country_id'])
					console.log('   name: ' + element['name']);
				});
			}
		})
	},

	collections: (more = {city_id:'1', lat:'', lon:'', count:'10'}) => {
		//   more = {
		//				city_id: city_id,
		//				lat: lat,
		//				lon: lon,
		//				count: count
		//   }
		state.url += '/collections';
		let temp = '?city_id=' + more.city_id;
		if(more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon.length !== 0) temp += '&lon=' + more.lon;
		temp += '&count=' + more.count;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let data = JSON.parse(body);
				data['collections'].forEach((element) => {
					console.log('Type: ' + element['collection']['title']);
					console.log('   Description : ' + element['collection']['description'])
					console.log('   No. of Restaurants: ' + element['collection']['res_count']);
				});
			}
		})
	},

	cuisines: (more = {city_id:'1', lat:'', lon:''}) => {
		//   more = {
		//				city_id: city_id,
		//				lat: lat,
		//				lon: lon,
		//   }
		state.url += '/cuisines';
		let temp = '?city_id=' + more.city_id;
		if(more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon.length !== 0) temp += '&lon=' + more.lon;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let data = JSON.parse(body);
				data['cuisines'].forEach((element) => {
					console.log(element['cuisine']['cuisine_name'] + '  (id: ' + element['cuisine']['cuisine_id'] + ')');
				});
			}
		})
	},

	establishments: (more = {city_id:'1', lat:'', lon:'', count:'10'}) => {
		//   more = {
		//				city_id: city_id,
		//				lat: lat,
		//				lon: lon,
		//   }
		state.url += '/establishments';
		let temp = '?city_id=' + more.city_id;
		if(more.lat.length !== 0) temp += '&lat=' + more.lat;
		if(more.lon.length !== 0) temp += '&lon=' + more.lon;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let data = JSON.parse(body);
				data['establishments'].forEach((element) => {
					console.log(element['establishment']['name'] + ' (id: ' + element['establishment']['id'] + ')');
				});
			}
		})
	},

	geocode: (more = {lat:'28', lon:'77'}) => {
		//   more = {
		//				lat: lat,
		//				lon: lon,
		//   }
		state.url += '/geocode';

		let temp = '?lat=' + more.lat;
		temp += '&lon=' + more.lon;

		state.url += temp;
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let element = JSON.parse(body);

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

			}
		})
	},

});



const Restaurant = (state) => ({
	dailymenu: (res_id = '-9999') => {
		if(res_id === '-9999') console.log('You need to provide res_id as argument...');

	}
});

Restaurant(state).dailymenu();


'use strict'

//Node version 6.x or above required

const request = require('request');

const url = "https://developers.zomato.com/api/v2.1";
let state = {
	url:url,
	method:'GET',
	headers:{
		'user-key': 'xxx'
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


});





Common(state).collections();


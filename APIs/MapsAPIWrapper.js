'use strict'

const request = require('request');



const Maps = () => ({
	places: (more={lat:'',lon:'',radius:'',type:'',name:''}, callback) => {
		const key = 'AIzaSyA9rnY3Ud1q3vswXsYFjd3qFFnvTDmMBmI'
		let state = {
			method: 'GET',
			url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
		}
		state.url += '?location=' + more.lat + ',' + more.lon
		state.url += '&radius=' + more.radius
		if(more.type && more.type !== '') state.url += '&type=' + more.type
		state.url += '&name=' + more.name
		state.url += '&key=' + key
		//
		//
		let out = {'places':[]}
		//
		//
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				//console.log(JSON.parse(body)['results']);
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body)['results']);
				});
				p.then( (data) => {
					try{
					for(var i=0;i<data.length; ++i){
						if(i>9 || i===data.length) return out
						let obj = {}
						obj['name'] = data[i]['name']
						obj['icon'] = data[i]['icon']
						obj['lat'] = data[i]['geometry']['location']['lat']
						obj['lon'] = data[i]['geometry']['location']['lng']
						if(data[i]['photos']) obj['photo_html'] = data[i]['photos'][0]['html_attributions']
						if(data[i]['opening_hours']) obj['open_now'] = data[i]['opening_hours']['open_now']
						obj['address'] = data[i]['vicinity']
						obj['rating'] = data[i]['rating']
						obj['types'] = data[i]['types']
						out['places'].push(obj)
					}
					}catch(err){
						console.log(err)
					}
				})
				.then( (data) =>{
					callback(null, data['places'])
				})
				.catch( (error) => {
					callback(error, null)
				})
			}else{
				callback(err, null);
			}
		})
	},

	direction: (more={origin:'', destination:'', mode:'driving'}, callback) => {
		const key = 'AIzaSyA9rnY3Ud1q3vswXsYFjd3qFFnvTDmMBmI'
		let state = {
			method: 'GET',
			url: 'https://maps.googleapis.com/maps/api/directions/json'
		}
		state.url += '?origin=' + more.origin
		state.url += '&destination=' + more.destination
		if(more.mode && more.mode.length !== 0){
			state.url += '&mode=' + more.mode
		}else{
			state.url += '&mode=driving'
		}
		state.url += '&key=' + key
		var out ={'steps':[]}
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					//console.log(body)
					data['routes'].forEach( (route, index) => {
						if(index>0) return out
						out['distance'] = route['legs'][0]['distance']['text']
						out['duration'] = route['legs'][0]['duration']['text']
						out['mode'] = route['legs'][0]['steps'][0]['travel_mode']
						route['legs'][0]['steps'].forEach( (step) => {
							let obj = {}
							obj['instruction'] = step['html_instructions']
							obj['step_distance'] = step['distance']['text']
							obj['step_duration'] = step['duration']['text']
							out['steps'].push(obj)
						})
					})
				})
				.then( (data) => {
					callback(null, out)
				})
				.catch( (error) => {
					console.log(error);
				})
			}
		})
	},
	geocoding: (more={'address':''}, callback) => {
		const key = 'AIzaSyA9rnY3Ud1q3vswXsYFjd3qFFnvTDmMBmI'
		let state = {
			method: 'GET',
			url: 'https://maps.googleapis.com/maps/api/geocode/json?address='
		}
		state.url += more['address']
		state.url += '&key=' + key
		var out =[]
		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body)['results'][0]);
				});
				p.then( (data) => {
					console.log(data)
				})
				.then( (data) => {
					callback(null, out)
				})
				.catch( (error) => {
					console.log(error);
				})
			}
		})
	},
	
});

module.exports = Maps

Maps().geocoding({'address':'Dwarka Mor, Delhi'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
//Maps('xxx').places(more={lat:'28.592140',lon:'77.046051',radius:'50000',type:'place',name:'India Gate'})
//Maps('xxx').direction(more={origin:'Dwarka Mor, Delhi, India', destination:'Dwarka Sector 4, Delhi, India', mode:'driving'})

const request = require('request');



const Maps = (key) => ({
	places: (more={lat:'',lon:'',radius:'',type:'',name:''}, callback) => {
		let state = {
			method: 'GET',
			url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
		}
		state.url += '?location=' + more.lat + ',' + more.lon
		state.url += '&radius=' + more.radius
		if(more.type && more.type !== '') state.url += '&type=' + more.type
		state.url += '&name=' + more.name
		state.url += '&key=' + key

		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				console.log(JSON.parse(body)['results']);
			}
		})
	},

	direction: (more={origin:'', destination:'', mode:'driving'}, callback) => {
		let state = {
			method: 'GET',
			url: 'https://maps.googleapis.com/maps/api/directions/json'
		}
		state.url += '?origin=' + more.origin
		state.url += '&destination=' + more.destination
		state.url += '&mode=' + more.mode
		state.url += '&key=' + key

		request(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					console.log(body)
					data['routes'].forEach( (route) => {
						console.log(route['legs'][0]['distance']['text'])
						console.log(route['legs'][0]['duration']['text'])
						console.log(route['legs'][0]['steps'][0]['travel_mode'])
						route['legs'][0]['steps'].forEach( (step) => {
							console.log(step['html_instructions'])
							console.log(step['distance']['text'])
							console.log(step['duration']['text'])
						})
					})
				})
				.catch( (error) => {
					console.log(error);
				})
			}
		})
	},

	
});



//Maps('xxx').places(more={lat:'28.592140',lon:'77.046051',radius:'50000',type:'place',name:'India Gate'})
//Maps('xxx').direction(more={origin:'Dwarka Mor, Delhi, India', destination:'Dwarka Sector 4, Delhi, India', mode:'driving'})

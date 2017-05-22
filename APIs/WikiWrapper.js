'use strict'

const req = require('request');

const Wiki = (state) => ({
	getSummary: (title) => {
		state.url += '?action=query&format=json&prop=extracts&exintro=&explaintext=&exsentences=4';  
		state.url += '&titles=' + title;
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body)['query']['pages']);
				});
				p.then( (data) => {
					return data[Object.keys(data)[0]];
				})
				.then( (data) => {
					console.log(data['extract'].replace(/\(.*?\)/g, ""));
				})
				.catch( (error) => {
					console.log(error);
				});
			}
			else if(err){
				console.log(err);
			}
		})
	},

	getLocality: (title) => {
		state.url += '?action=query&prop=categories&format=json&clshow=!hidden';
		state.url += '&titles=' + title;
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body)['query']['pages']);
				});
				p.then( (data) => {
					data = data[Object.keys(data)[0]]['categories'];
					for(var i = 0; i < data.length; ++i){
						let t = data[i]['title'];
						if(t.includes('Cities') || t.includes('Territories') || t.includes('Capitals')){
							console.log('City: ' + title);
							break;
						}else if(t.includes('States')){
							console.log('State: ' + title);
							break;
						}else if(t.includes('Countries')){
							console.log('Country: ' + title);
							break;
						}else if(t.includes('Continents')){
							console.log('Continent: ' + title);
						}
						//console.log(t);
					}
				})
				.catch( (error) => {
					console.log(error);
				});
			}
		});
	},

	getURL: (id) => {
		state.url += '?action=query&format=json&prop=info&inprop=url';
		state.url += '&pageids=' + id;
		
		req(state, (er, re, b) => {
			if(!er && re.statusCode === 200){
				let p1 = new Promise((resolve, reject) => {
					resolve(JSON.parse(b));
				});
				p1.then( (parsed) => {
					return parsed;
				});
			}
		});
	}
});



let state = {
	method: 'GET',
	url: 'https://en.wikipedia.org/w/api.php',
	headers: {
		'Api-User-Agent': 'Example/1.0',
	}
}

Wiki(state).getURL('Zomato');
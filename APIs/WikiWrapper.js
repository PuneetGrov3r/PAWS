'use strict'

const req = require('request');
const async = require('async')

const Wiki = () => ({
	getSummary: (more= {'title':''}, callback) => {
		let state = {
			method: 'GET',
			url: 'https://en.wikipedia.org/w/api.php',
			headers: {
				'Api-User-Agent': 'Example/1.0',
			}
		}
		let str = ''
		async.each(more['title'].split(' '), (item, cb) => {
			let p = new Promise((resolve, reject) => {
				resolve(item[0].toUpperCase())
			});
			p.then( (data) => {
				str += data + item.substring(1, item.length) + ' '
				cb(null)
			})
			.catch( (err) => {
				console.log(err);
			})

		}, (err) => {
			if(!err){
				let out = [{}]
				state.url += '?action=query&format=json&prop=extracts&exintro=&explaintext=&exsentences=4';
				state.url += '&titles=' + str;
				console.log(str)
				req(state, (err, res, body) => {
					if(!err && res.statusCode === 200){
						console.log("wikifunction")
						let p = new Promise((resolve, reject) => {
							resolve(JSON.parse(body)['query']['pages']);
						});
						p.then( (data) => {
							//console.log(data)
							//Wiki().getURL(Object.keys(data)[0], callback)
							return data[Object.keys(data)[0]]['extract'].replace(/\(.*?\)/g, ""));
						})
						.catch( (error) => {
							callback(err, null);
						});
					}
					else if(err){
						console.log(err, null);
					}
				})
			}else{
				console.log(err);
			}
		})

			
	},

	getLocality: (more = {'title':''}, callback) => {
		let state = {
			method: 'GET',
			url: 'https://en.wikipedia.org/w/api.php',
			headers: {
				'Api-User-Agent': 'Example/1.0',
			}
		}
		state.url += '?action=query&prop=categories&format=json&clshow=!hidden';
		state.url += '&titles=' + more['title'];
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
							callback(null, title);
							console.log('City: ' + title);
							break;
						}else if(t.includes('States')){
							callback(null, title);
							console.log('State: ' + title);
							break;
						}else if(t.includes('Countries')){
							callback(null, title);
							console.log('Country: ' + title);
							break;
						}else if(t.includes('Continents')){
							callback(null, title);
							console.log('Continent: ' + title);
						}
						//console.log(t);
					}
				})
				.catch( (error) => {
					callback(error, null);
					//console.log(error);
				});
			}
		});
	},

	getURL: (more = {'title':''}, callback) => {
		let state = {
			method: 'GET',
			url: 'https://en.wikipedia.org/w/api.php',
			headers: {
				'Api-User-Agent': 'Example/1.0',
			}
		}
		state.url += '?action=query&format=json&prop=extracts&exintro=&explaintext=&exsentences=4';  
		state.url += '&titles=' + more['title'];
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body)['query']['pages']);
				});
				p.then( (data) => {
					var id = Object.keys(data)[0]
					let state = {
						method: 'GET',
						url: 'https://en.wikipedia.org/w/api.php',
						headers: {
							'Api-User-Agent': 'Example/1.0',
						}
					}
					state.url += '?action=query&format=json&prop=info&inprop=url';
					state.url += '&pageids=' + id;
					
					req(state, (er, re, b) => {
						if(!er && re.statusCode === 200){
							let p1 = new Promise((resolve, reject) => {
								resolve(JSON.parse(b));
							});
							p1.then( (parsed) => {
								parsed = parsed['query']['pages'];
								parsed = parsed[Object.keys(parsed)[0]];
								callback(null, parsed['fullurl']);
							})
							.catch( (err) => {
								callback(err, null);
							})
						}
					});

				})
				.catch( (error) => {
					callback(err, null);
				});
			}
			else if(err){
				console.log(err, null);
			}
		})
	},

	getDefination: (more = {'word':''}, callback) => {
		let state = {
			method: 'GET',
			url: 'https://en.wiktionary.org/w/api.php',
			headers: {
				'Api-User-Agent': 'Example/1.0',
			}
		}
		state.url += '?format=json&action=query&prop=extracts';
		state.url += '&titles=' + more['word'];

		req(state, (er, re, b) => {
			if(!er && re.statusCode === 200){
				let p = new Promise( (resolve, reject) => {
					resolve(JSON.parse(b)['query']['pages']);
				});
				p.then( (data) => {
					return data[Object.keys(data)[0]]['extract'].replace(/<span.*?<\/span>|<p>.*?<\/p>/g, "").replace(/<h.>.*?<\/h.>/g, "").replace(/<.*?>/g, "").replace(/(\n)+/g,"\n").split('\n');
					//console.log(data);
				})
				.then( (data) => {
					let i;
					let regex = /^( )/;
					let regex2 = /\d{4}|\(.*\)|.*Wiki.*|(  )|.*William.*/;
					for(i=0;i<data.length;i++){
						if( !regex.test(data[i]) || data[i].length < 14 || regex2.test(data[i])){
							data.splice(i, 1);
							i--;
						}
					}
					console.log(data);
				})
				.catch( (err) => {
					callback(err, null)
				})
			}else {
				console.log(er);
			}
		});
	}
});


module.exports = Wiki

/*
Wiki().getDefination('cool', (err, data) => {
	if(err){
		console.log(err);
		return;
	}
	console.log(data);
});
Wiki().getURL('Mahatma Gandhi', (err, data) => {
	console.log(data)
})

*/
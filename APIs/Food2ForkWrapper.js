'use strict'

const req = require('request');


const Food = (key) => ({

	search: (name, callback) => {
		let state = {
			method: 'GET',
			url: 'http://food2fork.com/api/search'
		};
		state.url += '?key=' + key + '&q=' + name + '&sort=r';
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					data['recipes'].forEach( (recipe, index) => {
						if(index>4) return;
						let output = {
							title : recipe['title'],
							recipe_id: recipe['recipe_id'],
							image_url: recipe['image_url']
						}
						console.log(output);
					});
				})
			}
		});
	},

	recipe: (rId, callback) => {
		let state = {
			method: 'GET',
			url: 'http://food2fork.com/api/get'
		};
		state.url += '?key=' + key + '&rId=' + rId;
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					console.log(data)
				})
				.catch( (error) => {
					console.log(error);
				})
			}
			else if(err){
				console.log(err);
			}
		});
	}
});



Food('xxx').recipe('35171');
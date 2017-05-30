'use strict'

const req = require('request');


const Food = (key) => ({

	search: (name, callback) => {
		let state = {
			method: 'GET',
			url: 'http://food2fork.com/api/search'
		};
		//
		//
		//
		var out = {'food':[]}
		//
		//
		//
		state.url += '?key=' + key + '&q=' + name + '&sort=r';
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				
				p.then( (data) => {
					var i
					for(i=0;i<data['recipes'].length;++i){
						if(i>4) return out;
						let d = {
							title : data['recipes'][i]['title'],
							recipe_id: data['recipes'][i]['recipe_id'],
							image_url: data['recipes'][i]['image_url']
						}
						out['food'].push(d)
						//console.log(out);
					}
				})
				.then( (data) => {
					callback(null, out)
				})
				.catch( (error) => {
					callback(error, null);
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
		var out = {}
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					out['f2f_url'] = data['recipe']['f2f_url']
					out['ingredients'] = data['recipe']['ingredients']  // ***
					out['source_url'] = data['recipe']['source_url']   // **** Necesarry! Contains How to make ****
					out['recipe_id'] = data['recipe']['recipe_id']
					out['image_url'] = data['recipe']['image_url']   // ***
					out['title'] = data['recipe']['title']
					callback(null, out)
					//console.log(data)
				})
				.catch( (error) => {
					console.log(error);
				})
			}
			else if(err){
				console.log(err);
			}
		});
	},

	searchNRecipe: (name, callback) =>{
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
					let rId = data['recipes'][0]['recipe_id']
					Food(key).recipe(rId, callback)
				})
				.catch( (error) => {
					callback(error, null);
				})
			}
		});
	}
});





module.exports = Food

//Food('xxx').search('chicken biryani', (err, data) => {
//	console.log(data)
//})
//Food('xxx').recipe('35171', (err, data) => {
//	console.log(data);
//});

//Food('xxx').search('chicken biryani', (err, data) => {
//	if(!err){
//		Food('xxx').recipe(data['food'][0]['recipe_id'], (err, data) => {
//			console.log(data);
//		});
//	}else{
//		console.log(err);
//	}
//})
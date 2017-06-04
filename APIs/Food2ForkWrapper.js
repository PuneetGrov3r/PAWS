'use strict'

const req = require('request');
const async = require('async');

const Food = () => ({

	search: (more = {'name':''} , callback) => {
		const key = ''
		let state = {
			method: 'GET',
			url: 'http://food2fork.com/api/search'
		};
		//
		//
		//
		var out = []
		//
		//
		//
		state.url += '?key=' + key + '&q=' + more['name'] + '&sort=r';
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				
				p.then( (data) => {
					var i
					for(i=0;i<data['recipes'].length;++i){
						console.log(data['recipes'][i])
						if(i>4) return out;
						let d = {
							image_url: data['recipes'][i]['image_url'],
							title : data['recipes'][i]['title'],
							recipe_id: data['recipes'][i]['recipe_id'],
						}
						out.push(d)
						//console.log(out);
					}
				}).then( (data) => {
					if(data){
						callback(null, out)
					}
				}).catch( (error) => {
					callback(error, null);
				})
			}
		});
	},

	recipe: (more = {'rId': ''}, callback) => {
		const key = ''
		let state = {
			method: 'GET',
			url: 'http://food2fork.com/api/get'
		};
		state.url += '?key=' + key + '&rId=' + more['rId'];
		var out = []
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					let o = {}
					o['image_url'] = data['recipe']['image_url']   // ***
					o['title'] = data['recipe']['title']
					o['f2f_url'] = data['recipe']['f2f_url']
					o['ingredients'] = data['recipe']['ingredients']  // ***
					o['source_url'] = data['recipe']['source_url']   // **** Necesarry! Contains How to make ****
					//out['recipe_id'] = data['recipe']['recipe_id']
					callback(null, out.push(o))
					//console.log(data)
				}).catch( (error) => {
					console.log(error);
				})
			}
			else if(err){
				console.log(err);
			}
		});
	},

	searchNRecipe: (more = {'name': ''}, callback) =>{
		const key = ''
		let state = {
			method: 'GET',
			url: 'http://food2fork.com/api/search'
		};
		state.url += '?key=' + key + '&q=' + more['name'] + '&sort=r';
		req(state, (err, res, body) => {
			
			if(!err && res.statusCode === 200){
				var out = []
				async.each(JSON.parse(body)['recipes'], (item, cb) => {
					let rId = item['recipe_id']
					let st = {
							method: 'GET',
							url: 'http://food2fork.com/api/get'
						};
					st.url += '?key=' + key + '&rId=' + rId;
					req(st, (err, res, body) => {
						if(!err && res.statusCode === 200){
							let p = new Promise((resolve, reject) => {
								resolve(JSON.parse(body))
							});
							let o = {}
							p.then( (data) =>{
								o['image_url'] = data['recipe']['image_url']   // ****
								o['title'] = data['recipe']['title']
								//o['f2f_url'] = data['recipe']['f2f_url']
								o['description'] = data['recipe']['ingredients'].join('\n')  // ****
								o['url'] = data['recipe']['source_url']   // **** Necesarry! Contains How to make ****
								//out['recipe_id'] = data['recipe']['recipe_id']
								out.push(o)
								cb(null)
							}).catch( (e)=>{
								console.log(e)
							})
						}
					})
				},(err)=>{
					if(err){
						console.log(err)      
					}else{
						callback(null, out)
					}
				})
			}
		});
	}
});



module.exports = Food


/*

Food().searchNRecipe({'name':'chicken biryani'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
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
*/
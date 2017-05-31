const prettyjson = require('prettyjson')
const mainWrapper = require('./MainWrapper.js')


/*
mainWrapper.food2fork['search']({'name':'Butter Chicken'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
*/
/*
mainWrapper.Wikipedia['summary']({'title': 'india gate'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})	


mainWrapper.Wikipedia['definition']({'word':'atom'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
*/
/*
newsQuery = ['financial markets', 'hollywood updates', 'science updates', 'top stories', 'world news']

mainWrapper.bing['search']({
	'searchObject': {
		'searchQuery': 'world news',   //Fuzzy here
		'count': '10',
		'offset': '0',
		'market': 'en-us',
		'safeSearch': 'Moderate'
		}
}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
*/
/*
mainWrapper.food2fork['searchNRecipe']({'name': 'Chiken Biryani'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
*/

mainWrapper.flipkart['search']({'searchQuery' : 'iPhone'}, (err, data) =>{
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})

mainWrapper.Maps['geocoding']({'address':'NSIT, Dwarka More, New Delhi'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})
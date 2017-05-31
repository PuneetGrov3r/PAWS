let prettyjson = require('prettyjson')
//let Weather = require('./OpenWeatherWrapper.js')
//let Wiki = require('./WikiWrapper.js')

let mainWrapper = require('./MainWrapper.js')

/*
Weather('fd69a8bec4fb9cd33f7a1cf60f4871eb').forecast('28.612205','77.034980',(data)=>{
	console.log("inside")
	console.log(prettyjson.render(data))
})
Wiki().getSummary('water',(err,data)=>{
	console.log(prettyjson.render(data))
})
Wiki().getURL('Mahatma Gandhi',(err,data)=>{
	console.log(data)
});
*/
/*
mainWrapper.food2fork['search']({'name':'Butter Chicken'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})

mainWrapper.wiki['summary']({'title': 'India Gate'}, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(err, data)
	}
})	
*/
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
let express = require("express")
let session = require('./session.js')
let shortid = require('shortid')
let morgan = require('morgan')
var pyInt = require('./pythonIntegrate');

let app = express()
let sessionsObj = {}

let port = 3000


app.use(morgan('short'))
app.use(express.static(__dirname+"/public"));

app.get('/startSession',(req,res,next)=>{
	console.log("inside startSession")
	console.log(req.query)



	let id = shortid.generate()
	sessionsObj[id] = new session(id,"0","0")
	res.end(id)

})

app.get('/requestMessage',(req,res,next)=>{
	
	var msg = req.query["message"]
	var sessionId = req.query["sessionId"]
	console.log(msg)
	let currentSession = sessionsObj[sessionId]
	
	currentSession.parseMessage(msg,(replyObj)=>{
		console.log(replyObj)
		res.end(replyObj)
	})







	

	
})



app.listen(port, ()=>{
    console.log('Listening on port: ' + port);
});

process.on('SIGINT', process.exit);
process.on('SIGTERM', process.exit);
process.on('exit', function () {

});


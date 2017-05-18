let express = require("express")
let session = require('./session.js')
let shortid = require('shortid')
let morgan = require('morgan')
let app = express()
let sessionsObj = {}

let port = 3000


app.use(morgan('short'))
app.use(express.static(__dirname+"/public"));

app.post('/startSession',(req,res,next)=>{
	let id = shortid.generate()
	sessionsObj[id] = new session(id)
	res.end(id)

})

app.post('/requestMessage',(req,res,next)=>{
	console.log(req.params)
	console.log(req.query)
	res.end("Lol")
})



app.listen(port, ()=>{
    console.log('Listening on port: ' + port);
});

process.on('SIGINT', process.exit);
process.on('SIGTERM', process.exit);
process.on('exit', function () {

});


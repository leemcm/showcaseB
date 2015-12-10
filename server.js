var express = require('express');
var app = express();
var multer = require('multer');
// var multer = require('multer-old');
var showcase = require('./showcase');

var upload = multer({ dest: './uploads/'});
//set middleware for multer
app.use(upload);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies

// points to directories that contain static pages. 
app.use(express.static('public'));
app.use(express.static('uploads'));

// app.get("/api/imageUploadMockup", showcase.imageUploadMockup);// for mockup
app.post("/api/imageUpload", showcase.imageUpload);
app.post("/api/textUpload", showcase.textUpload);
// app.post("/api/appendTag", showcase.appendTag); should not be required anymore
app.get("/api/textGet", showcase.textGet);
app.get("/api/imageGet", showcase.imageGet);
app.get("/api/search", showcase.tagSearch);
app.post("/api/imageRemove", showcase.imageRemove);
// app.post("/api/imageTest", showcase.imageTest); Is now imageUpload

app.get('/', function (req, res) {
	console.log("GET request for homepage");
	var filePath = __dirname + '/public/index.html';
	res.send(filePath);
});

app.get('*', function (req, res) {
	// 404
	var filePath = __dirname + '/public/404.html';
	res.status(404).sendFile(filePath);
})

// set up the express server to listen on port 3000
var server = app.listen(3000, function () {
	// extract address and port for logging (not functional)
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server on. Listening to localhost:3000");
	//-------------------------------------
});
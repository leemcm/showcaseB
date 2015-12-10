var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('showcase.db');


var images = [];
var container = [];

db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS fileUploads (fileID INTEGER PRIMARY KEY NOT NULL, fileName TEXT NOT NULL, uploadName TEXT NOT NULL, uploadTime TEXT NOT NULL)"); 
	db.run("CREATE TABLE IF NOT EXISTS textUploads (textID INTEGER PRIMARY KEY NOT NULL, textName TEXT NOT NULL, content TEXT NOT NULL, uploadTime TEXT NOT NULL)");
	db.run("CREATE TABLE IF NOT EXISTS fileIDTable (fileID INTEGER NOT NULL, tagID INTEGER NOT NULL)");
	db.run("CREATE TABLE IF NOT EXISTS textIDTable (textID INTEGER NOT NULL, tagID INTEGER NOT NULL)");
	db.run("CREATE TABLE IF NOT EXISTS tagTable (tagID INTEGER PRIMARY KEY NOT NULL, tagName TEXT NOT NULL)");
});

// exports.imageUpload = function (req, res) {

	/* ------------- Ajax 1 page ver, on hold --------------------
	Do not delete, this version will be used for the single page solution if possible
	console.log("post request");
	console.log(req.body); //log json
	// console.log(req.body.file);
	res.status(200).send("file received"); //response to the client
			--------------- End --------------------*/


// 	upload(req, res, function (err) {
// 		// console.log(req.files);
// 		// console.log(req.body);

// 		var date = new Date();
// 		db.run("INSERT INTO fileUploads (fileName, uploadName, uploadTime) VALUES (?,?,?)",
// 		req.files.image.name, req.body.image_name, date,  function(err) {
// 			errorPrint(err);
// 		});
// 		res.redirect("/showcase2.html");
// 	});
// };

exports.textUpload = function (req, res) {
	// console.log("post request");
	// console.log(req.body); //log json
	// console.log("textname: " + req.body.textname);
	// console.log("content: " + req.body.content);
	var d = new Date();
	db.run('INSERT INTO textUploads (textName, content, uploadTime) VALUES ("'+req.body.textname+'", "'+req.body.content+'","'+d.toDateString()+'")', function (err) {
		errorPrint(err);
	});
	res.redirect("/");
	
};

exports.textGet = function (req, res) {
	// console.log("text get request");
	var returnText = [];
	db.each("SELECT rowid AS id, textName, content, uploadTime FROM textUploads", function (err, row) {
		errorPrint(err);
		// console.log(row.id + ": " + row.textName + ": " + row.content + ": " + row.uploadTime);
		var jsonInfo = {
			"id" : row.id,
			"name" : row.textName,
			"content" : row.content,
			"time" : row.uploadTime
		};
		returnText.push(jsonInfo);
		// console.log("returnText post push: " + returnText)
	}, function () {
		// console.log("pre send: " + returnText);
		res.status(200).json(returnText);
	});
	
}

exports.imageGet = function (req, res) {
	// console.log("image get request");
	var returnText = [];
	var total = -1;
	db.each("SELECT rowid AS id, fileName, uploadName, uploadTime FROM fileUploads", function (err, row) {
		total++;
		errorPrint(err);
		// console.log(row.id + ": " + row.fileName + ": " + row.uploadName + ": " + row.uploadTime);
		var jsonInfo = {
			"id" : row.id,
			"imageName" : row.fileName,
			"name" : row.uploadName,
			"time" : row.uploadTime
		};
		returnText.push(jsonInfo);
		/*var tagsIdArray = [];
		db.each("SELECT tagID FROM fileIDTable WHERE fileID="+row.id+";", function (err, result) {
			// console.log(result);
			tagsIdArray.push(result);
		}, function () {
			var arrayPos = 0;
			var tagsArray = [];
			tagBoop(tagsArray, tagsIdArray, arrayPos, jsonInfo, function (tagsArray) {
				console.log("TTTTTAGSARRAY");
				console.log(tagsArray);
				console.log(jsonInfo);
				returnText.push(jsonInfo);
			});
		});*/
		// console.log("returnText post push: " + returnText)
	}, function () {
		// console.log("pre send: " + returnText);
		res.status(200).json(returnText);
	});
}

/*function tagBoop (tagsArray, tagsIdArray, arrayPos, jsonInfo, callback) {
	db.run("SELECT tagName FROM tagTable WHERE tagID="+tagsIdArray[arrayPos].tagID+";", function (err, result) {
		tagsArray.push(result);
	}, function () {
		arrayPos++;
		console.log("BOB"+arrayPos);
		console.log(tagsIdArray);
		if (tagsIdArray.length === arrayPos) {
			// callback(tagsArray);
			console.log("Finito");
		} else {
			// console.log("looping");
			tagBoop(tagsArray, tagsIdArray, arrayPos, callback);
		}
	});
};*/

exports.tagSearch = function (req, res) {
	var search = req.query.Search;
	// console.log(search);
	db.get("SELECT tagID FROM tagTable WHERE tagName LIKE '%" + search + "%';", function (err, row) {
		errorPrint(err);
		// console.log(row);
		if(row !== undefined) {
			db.get("SELECT fileID FROM fileIDTable WHERE tagID = ?;", row.tagID, function (err, fRow) {
				errorPrint(err);
				// console.log(fRow);
				if(fRow !== undefined) {   
					db.get("SELECT * FROM fileUploads WHERE fileID = ?;", fRow.fileID, function (err, fuRow){
						errorPrint(err);
						res.send(fuRow);
					});
				}else{
					res.send('No matching file')
				}
			});
		}else{
			res.send('No matching tag')
		}
	});
};

exports.imageRemove = function (req, res) {
	// console.log(req.body);
	// console.log(req.body.imageId);
	db.run("DELETE FROM fileUploads WHERE fileID = "+req.body.imageId+" ;", function (err) {
		res.send("image deleted");
	});
};

exports.imageUpload = function (req, res) {
	var fileName = req.files.imageFile.name;
	console.log(fileName);
	console.log(req.body);
	var jsonData = JSON.parse(req.body.json)
	console.log(jsonData.name);
	// console.log(req.files.image.name);
	var d = new Date();
	db.run('INSERT INTO fileUploads (fileName, uploadName, uploadTime) VALUES ("'+fileName+'", "'+jsonData.name+'","'+d.toDateString()+'")', function (err) {
			errorPrint(err);
			db.get('SELECT fileID FROM fileUploads WHERE fileName="'+fileName+'"', function (err, result) {
				errorPrint(err);
				console.log(result);
				var uploadId = result.fileID;
				// console.log(uploadId);
				console.log("Memes" + jsonData.tagsArray[0].tagName);
				addTags(res, jsonData.tagsArray, "file", uploadId);
			});
	});
	// res.status(200).send("Image added to the database.");

	
}

function addTags (res, tagsArray, uploadType, uploadId) {
	var arrayPos = 0;
	var errArray = [];
	var tagsIdArray = []; // errArray and tagsIdArray perform similar operations, can be optimised to only use one.
	var resStatus;

	loopTags(tagsArray, arrayPos, tagsIdArray, uploadType, uploadId, errArray, function (tagsArray, tagsIdArray, uploadType, uploadId, errArray) {
		var resMsg;
		var errStatus = false;
		// console.log(errArray);
		for (var i = 0; i < errArray.length; i++) {
			if (errArray[i]) {
				if (!errStatus) {
					resMsg = "There was an error with the tags: "
				}
				resMsg += tagsArray[i].tagName+", ";
				errStatus = true;
			}
		};

		if (!errStatus) {
			var arrayPos = 0;
			insertDbTags(uploadType, uploadId, tagsIdArray, arrayPos, function () {
				// console.log("Inserted to db");
				resStatus = 200;
				resMsg = "Image uploaded successfully."
				// console.log("Response message: " + resMsg + " Response status: " + resStatus);
				res.status(resStatus).send(resMsg);
			});
		} else {
			resStatus = 400;
			resMsg += "Please check your spelling or your formatting." //TO DO - Check for duplicate tags
			// console.log("Response message: " + resMsg + " Response status: " + resStatus);
			res.status(resStatus).send(resMsg);
		};
	});
}

function insertDbTags (uploadType, uploadId, tagsIdArray, arrayPos, callback) {
	// console.log(tagsIdArray);
	db.run('INSERT INTO '+uploadType+'IDTable ('+uploadType+'ID, tagID) VALUES ("'+uploadId+'", "'+tagsIdArray[arrayPos].tagID+'")', function (err) {
		errorPrint(err);
		// console.log("Ran, : " + arrayPos);
		arrayPos++;
		if (tagsIdArray.length === arrayPos) {
			callback();
		} else {
			// console.log("looping");
			insertDbTags(uploadType, uploadId, tagsIdArray, arrayPos, callback);
		}
	});
}
//loopTags(tagsArray, arrayPos, tagsIdArray, uploadType, uploadId, errArray, function
function loopTags (tagsArray, arrayPos, tagsIdArray, uploadType, uploadId, errArray, callback) {
	console.log("tagsArray");
	console.log(tagsArray);
	// console.log("console.log 1 arrayPos: " + arrayPos);
	// console.log("Array pos: " + arrayPos);
	// console.log("tagsArray val: " + tagsArray[arrayPos].tagName);
	var currentTag = tagsArray[arrayPos].tagName
	db.get('SELECT tagID FROM tagTable WHERE LOWER(tagName)="'+currentTag.toLowerCase()+'"', function (err, result) {
		errorPrint(err);
		// console.log(result);
		if (result){
			// console.log("Is in database");
			errArray.push(false);
			tagsIdArray.push(result);
		} else {
			// console.log("Isnt in database");
			errArray.push(true);
		}
		arrayPos++;
		// console.log("console.log 2 arrayPos: " + arrayPos);
		if (tagsArray.length === arrayPos) {
			console.log("finito");
			callback(tagsArray, tagsIdArray, uploadType, uploadId, errArray);
		} else {
			console.log("not finito");
			loopTags(tagsArray, arrayPos, tagsIdArray, uploadType, uploadId, errArray, callback);
		}
	});
};

function errorPrint (err) {
	if (err) {
		console.log("Error Output - " + err);
	}
}

// Legacy below:---------------------------------------------

// exports.imageUploadMockup = function (req, res) {
// 	/* Mock up --------- Legacy code*/
// 	console.log(req.query);
// 	images[0] = req.query.file;
// 	console.log(images[0]);
// 	res.writeHeader(200, {"Content-Type": "text/html"});  
// 	res.write('<a href="/showcase.html">upload another image</a><br/>The image you requested was: ' + images[0] + '<br/> <img src="/img/' + images[0] +'">');
// 	// res.write('<img src="/img/' + images[0] +'">');  
// 	res.end();
// }

// app.get('/api/upload',function(req,res) {
// res.json(images);
// });

/* Legacy for appending tags, here as backup
exports.appendTag = function (req, res) {
	var arrayPos = 0;
	var errArray = [];
	var tagsIdArray = []; // errArray and tagsIdArray perform similar operations, can be optimised to only use one.
	var resStatus;
	loopTags(req.body.tagsArray, arrayPos, tagsIdArray, errArray, function (tagsIdArray, errArray) {
		var resMsg;
		var errStatus = false;
		// console.log(errArray);
		for (var i = 0; i < errArray.length; i++) {
			if (errArray[i]) {
				if (!errStatus) {
					resMsg = "There was an error with the tags: "
				}
				resMsg += req.body.tagsArray[i].tagName+", ";
				errStatus = true;
			}
		};

		if (!errStatus) {
			var fileID = 1
			var arrayPos = 0;
			insertDbTags(fileID, tagsIdArray, arrayPos, function () {
				// console.log("Inserted to db");
				resStatus = 200;
				resMsg = "Tags saved."
				// console.log("Response message: " + resMsg + " Response status: " + resStatus);
				res.status(resStatus).send(resMsg);
			});
		} else {
			resStatus = 400;
			resMsg += "Please check your spelling or your formatting."
			// console.log("Response message: " + resMsg + " Response status: " + resStatus);
			res.status(resStatus).send(resMsg);
		};
	});
};

function insertDbTags (fileID, tagsIdArray, arrayPos, callback) {
	// console.log(tagsIdArray);
	db.run('INSERT INTO fileIDTable (fileID, tagID) VALUES ("'+fileID+'", "'+tagsIdArray[arrayPos].tagID+'")', function (err) {
		errorPrint(err);
		// console.log("Ran, : " + arrayPos);
		arrayPos++;
		if (tagsIdArray.length === arrayPos) {
			callback();
		} else {
			// console.log("looping");
			insertDbTags(fileID, tagsIdArray, arrayPos, callback);
		}
	});
}

function loopTags (tagsArray, arrayPos, tagsIdArray, errArray, callback) {
	// console.log("console.log 1 arrayPos: " + arrayPos);
	// console.log("Array pos: " + arrayPos);
	// console.log("tagsArray val: " + tagsArray[arrayPos].tagName);
	db.get('SELECT tagID FROM tagTable WHERE tagName="'+tagsArray[arrayPos].tagName+'"', function (err, result) {
		errorPrint(err);
		// console.log(result);
		if (result){
			// console.log("Is in database");
			errArray.push(false);
			tagsIdArray.push(result);
		} else {
			// console.log("Isnt in database");
			errArray.push(true);
		}
		arrayPos++;
		// console.log("console.log 2 arrayPos: " + arrayPos);
		if (tagsArray.length === arrayPos) {
			// console.log("finito");
			callback(tagsIdArray, errArray);
		} else {
			// console.log("not finito");
			loopTags(tagsArray, arrayPos, tagsIdArray, errArray, callback);
		}
	});
};*/
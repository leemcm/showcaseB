function submitImage () {
	var http = new XMLHttpRequest();
	var url = "/api/imageUpload";
	var file = document.getElementById('image').files[0];
	var name = document.getElementById('imageName').value;
	var tags = document.getElementById('imageTags').value;
	var tagsArray = processTags(tags);
	// console.log(file);
	var formData = new FormData();
	formData.append('imageFile', file);
	var jsonData = '{"name":"'+name+'", '+tagsArray+'}';
	// console.log("json: " + jsonData);
	formData.append('json', jsonData);

	http.open("POST", url, true);

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			alert(http.responseText);
			getImage();
		}
	}
	http.send(formData);
};

function imageRemove (imageData) {
	var http = new XMLHttpRequest();
	var url = "/api/imageRemove";
    
    var imageName = imageData.getAttribute("data-imageName");
    var imageId = imageData.getAttribute("data-imageId");
	var params = '{"imageName":"'+imageName+'", "imageId":"'+imageId+'"}';
    
	http.open("POST", url, true);

	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			console.log(http.responseText);
		}
	}

	http.send(params);
};

function submitText () {
	var http = new XMLHttpRequest();
	var url = "/api/textUpload";
	var name = document.getElementById('text-name').value;
	var content = document.getElementById('text-content').value;
	var params = '{"textname":"'+name+'", "content":"'+content+'"}';
	console.log("json: " + params);
	http.open("POST", url, true);

	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			console.log(http.responseText);
		}
	}
	http.send(params);
};

function getText () {
	var http = new XMLHttpRequest();
	var url = "/api/textGet";
	http.open("GET", url, true);

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			$('#contain_text').html('');
			console.log(http.responseText);
			var jsonResponse = JSON.parse(http.response);
			console.log(jsonResponse[0].id);
			var list = "<li>bob</li>";
			for (var i = 0; i < jsonResponse.length; i++) {
				// $('#contain_text').append($('<h1>').text(jsonResponse[i].name));
				// $('#contain_text').append($('<p>').html(jsonResponse[i].content));
				// $('#contain_text').append($('<p>').text("Time: " + jsonResponse[i].time));
				var html = '<div class="textContainer col-md-6">'+
					'<div class="textPrettyContainer">'+
					'<h1>'+jsonResponse[i].name+'</h1>'+
					'<div class="textDiv">'+
					'<span class="glyphicon glyphicon-remove-circle appear" onclick="imageRemove(this)" data-imageName="'+jsonResponse[i].name+'" data-imageId="'+jsonResponse[i].id+'"></span>'+
					'<span class="glyphicon glyphicon-pencil appear2"></span>'+
					'<div>'+jsonResponse[i].content+'</div>'+
					'</div>'+
					'<div class="tagContainer">'+
					'<ul>'+
					list+
					list+
					list+
					list+
					list+
					list+
					list+
					list+
					'</div>'+
					'</div>'+
					'</div>';
				$('#contain_text').append(html);
			};
		}
	}
	http.send();
};

function getImage () {
	var http = new XMLHttpRequest();
	var url = "/api/imageGet";
	http.open("GET", url, true);

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			$('#contain_image').html('');
			console.log(http.responseText);
			var jsonResponse = JSON.parse(http.response);
			// for (var i = 0; i < jsonResponse.tags.length; i++) {
			// 	jsonResponse.tags[i]
			// };
			var list = "<li>bob</li>";
			console.log(jsonResponse[0].imageName);
			for (var i = 0; i < jsonResponse.length; i++) {
				var html = '<div class="imageContainer col-md-3">'+
					'<div class="imagePrettyContainer">'+
					'<h1>'+jsonResponse[i].name+'</h1>'+
					'<div class="imageDiv">'+
					'<span class="glyphicon glyphicon-remove-circle appear" onclick="imageRemove(this)" data-imageName="'+jsonResponse[i].name+'" data-imageId="'+jsonResponse[i].id+'"></span>'+
					'<span class="glyphicon glyphicon-pencil appear2"></span>'+
					'<img src="/'+jsonResponse[i].imageName+'">'+
					'</div>'+
					'<div class="tagContainer">'+
					'<ul>'+
					list+
					list+
					list+
					list+
					list+
					list+
					list+
					list+
					'</div>'+
					'</div>'+
					'</div>';
				$('#contain_image').append(html);
			};
			getText();
		}
	}
	http.send();
}
// function submitImageTag () {
// 	var http = new XMLHttpRequest();
// 	var url = "/api/appendTag";
// 	var tags = document.getElementById('image-tag').value;

// 	var params = processTags(tags);

// 	// http.open("POST", url, true);

// 	// http.setRequestHeader("Content-type", "application/json"); //note: conttype for single page ajax json 
// 	// http.setRequestHeader("Content-length", params.length);
// 	// http.setRequestHeader("Connection", "close");

// 	// http.onreadystatechange = function() {//Call a function when the state changes.
// 	// 	if(http.readyState == 4 && http.status == 200) {
// 	// 		console.log(http.responseText);
// 	// 	}
// 	// }
// 	console.log("Pre-send: " + params);
// 	// http.send(params);
// };

function processTags (tags) { // processes tags for sending
	
	var tagsArray = tags.split(", ");
	// console.log(tagsArray);

	var params = '"tagsArray":[';

	for (var i = 0; i < tagsArray.length; i++) {
		params += '{"tagName":"'+tagsArray[i]+'"}';
		if (i === tagsArray.length - 1) {
			console.log("Both same");
			params += ']';
		} else {
			console.log("Else");
			params += ",";
		};
	};
	return params;
}

document.getElementById('Search').onsubmit = function (e) {
	e.preventDefault();
    var http = new XMLHttpRequest();
   
	var url = "/api/search?Search=" + document.getElementById('tags').value;
	http.open("GET", url, true);

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			console.log(http.responseText);
			var jsonResponse2 = JSON.parse(http.response);
			console.log(jsonResponse2.fileName);
//			for (var i = 0; i < jsonResponse2.length; i++) {
				$('#contain_image').append($('<h1>').text(jsonResponse2.uploadName));
				// $('#contain_image').append($('<div>').append($('<img src="'+jsonResponse[i].image+'" width="250" height= "250">')));
				var html = '<div>'+
					'<span class="glyphicon glyphicon-remove-circle appear" onclick="imageRemove(this)" data-imageName="'+jsonResponse2.uploadName+'" data-imageId="'+jsonResponse2.fileID+'"></span>'+
					'<span class="glyphicon glyphicon-pencil appear2"></span>'+
					'<img src="/'+jsonResponse2.fileName+'">'+
					'</div>';
				$('#contain_image').append(html);
//			};
		}
	}
	http.send();
}
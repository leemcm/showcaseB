function templateGet (array, arrayN) {
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
    	if (xhttp.readyState == 4 && xhttp.status == 200) {
    	 	document.body.insertAdjacentHTML('beforeend',xhttp.responseText);
    	 	console.log("arrayN: " + arrayN);
    	 	if (arrayN < array.length - 1) {
  				templateGet (array, arrayN + 1);
  			}
    	}
	}
  	xhttp.open("GET", array[arrayN] + ".html", true);
  	xhttp.send();
}

function template () {
	var templateElements = ["header", "main", "footer"];
	templateGet(templateElements, 0);
}
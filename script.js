// const oboe = require('oboe');

let body = document.body;
let postList = document.getElementById("postList");

// let button = document.createElement("button");
// button.appendChild(document.createTextNode("Create a new box"));
// body.appendChild(button);

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function htmlDecode(input){
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes[0].nodeValue;
}

function highlight(element, text) {
	text = text.replace("\"", "");
	let innerHTML = element.innerHTML;
	let innerHTML2 = innerHTML.toUpperCase();
	
	let index = 0;
	do {
		index = innerHTML2.indexOf(text.toUpperCase(), index);
		if (index >= 0) { 
			innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
			innerHTML2 = innerHTML.toUpperCase();
			element.innerHTML = innerHTML;
			index = index + 32;
		}
	} while (index > -1);

	// if (index >= 0) { 
	// 	innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
	// 	element.innerHTML = innerHTML;
	// }
};

function timeSince(date) {
	let seconds = Math.floor((new Date() - date) / 1000);
	let interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
	  return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
	  return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
	  return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
	  return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
	  return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
  }
let aDay = 24*60*60*1000;

function newBox(Username, Subreddit, Msg, link, keyword) {
	let div = document.createElement("div");
	div.setAttribute("class", "box");
	// if (getRandomInt(2) == 0) {
	// 	div.setAttribute("class", "box right");
	// }

	let line = document.createElement("div");
	line.setAttribute("class", "line");

	let username = document.createElement("p");
	username.setAttribute("class", "username");
	username.appendChild(document.createTextNode(Username));

	let subreddit = document.createElement("p");
	subreddit.setAttribute("class", "subreddit");
	subreddit.appendChild(document.createTextNode(Subreddit));

	let msg = document.createElement("p");
	msg.setAttribute("class", "msg");
	Msg = htmlDecode(Msg);
	msg.appendChild(document.createTextNode(Msg));
	msg.innerHTML = msg.innerHTML.replace(/\n\n/gi, "<br><br>")

	let keywords = keyword.split(" ");
	for (let i = 0; i < keywords.length; i++) {
		highlight(msg, keywords[i]);
	}
	// highlight(msg, keyword);

	let viewpostDiv = document.createElement("div");
	viewpostDiv.setAttribute("class", "viewpost");

	let viewpost = document.createElement("a");
	viewpost.setAttribute("href", "https://reddit.com" + link);
	viewpost.setAttribute("target", "_blank");
	viewpost.appendChild(document.createTextNode("View post"));

	viewpostDiv.appendChild(viewpost);

	div.appendChild(line);
	div.appendChild(username);
	div.appendChild(subreddit);
	div.appendChild(msg);
	div.appendChild(viewpostDiv);

	postList.appendChild(div);
	// body.insertBefore(div, button);
	// body.appendChild(div);
}

function clearBoxes() {
	while (postList.firstChild) {
		postList.removeChild(postList.firstChild);
	}
}

// fetch("https://pwrism.com/api/v1/options").then(function(response) {
// 	console.log(response);
// });

// fetch("https://pwrism.com/api/v1/options").then(function(response) {
// 	response.json().then(function(text) {
// 		console.log(text);
// 	});
// });

function request(url, callback) {
	return new Promise(function(resolve, reject) {
		fetch(url).then((response) => {
			// callback(response);
			response.json().then((text) => {
				callback(text, response);
				resolve();
			});
		});
	});
}

// (async function() {
// 	console.log("a");
// 	await request("https://pwrism.com/api/v1/options", (text, response) => {
// 		console.log(text + response.status);
// 	});
// 	console.log("b");
// })();


let lookupButton = document.getElementById("lookupButton");
let lookupInput = document.getElementById("lookupInput");
lookupInput.addEventListener("keyup", function(e) {
	if (e.keyCode == 13) {
		snoop();
	}
})
lookupButton.addEventListener("click", function() {
	snoop();
});

// function snoop() {
// 	if (lookupInput.value == "") {
// 		return;
// 	}
	// request("https://api.pushshift.io/reddit/search/comment/?q=" + lookupInput.value + "&size=50", function(data, response) {
	// 	clearBoxes();
	// 	if (response.status != 200) {
	// 		// TODO: Display error
	// 		return;
	// 	}

	// 	for (const post of data.data) {
	// 		let date = new Date();
	// 		date.setTime(post.created_utc*1000);
	// 		newBox(post.author, "/r/" + post.subreddit + " - " + timeSince(date) + " ago", post.body, post.permalink, lookupInput.value);	
	// 	}
	// });
// }

function snoop() {
	if (lookupInput.value == "") {
		return;
	}
	clearBoxes();
	oboe("https://api.pushshift.io/reddit/search/comment/?q=" + lookupInput.value + "&size=500")
	.node('data.*', function( post ){
		console.log("Post by: " + post.author);
		let date = new Date();
		date.setTime(post.created_utc*1000);
		newBox(post.author, "/r/" + post.subreddit + " - " + timeSince(date) + " ago", post.body, post.permalink, lookupInput.value);	
	})
   .done(function(things) {
		// console.log("got it");
      // we got it
   })
   .fail(function() {
		// console.log("dont got it");
      // we don't got it
});
}

// oboe("https://api.pushshift.io/reddit/search/comment/?q=test")
// 	.node('data.*', function( thing ){

// 		// This callback will be called everytime a new object is
// 		// found in the foods array.

// 		console.log(thing);
// 	})
//    .done(function(things) {
// 		console.log("got it");
//       // we got it
//    })
//    .fail(function() {
// 		console.log("dont got it");
//       // we don't got it
// });
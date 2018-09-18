---
---

function unicodeUnEscape(string) {
	return string.replace(/%u([\dA-Z]{4})|%([\dA-Z]{2})/g, function(_, m1, m2) {
		return String.fromCharCode(parseInt("0x" + (m1 || m2)));
	});
}

function getParam(param) {
	var queryString = window.location.search.substring(1);
	queryString = unicodeUnEscape(decodeURIComponent(queryString.replace(/\+/g, "%20")));
	var queries = queryString.split('&');
	
	for (var i in queries) {
		var pair = queries[i].split('=');
		if (pair[0] == param) {
			return pair[1];
		}
	}

	return null;
}
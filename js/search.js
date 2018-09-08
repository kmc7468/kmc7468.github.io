---
---

function unicodeUnEscape(string) {
	return string.replace(/%u([\dA-Z]{4})|%([\dA-Z]{2})/g, function(_, m1, m2) {
		return String.fromCharCode(parseInt("0x" + (m1 || m2)));
	});
}

function getParam(param) {
	var result = new RegExp("[\?&]" + param + "=([^&#]*)").exec(window.location.href);
	if (result == null) {
		return null;
	} else {
		return unicodeUnEscape(decodeURI(result[1]));
	}
}

function getText(path, process) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				process(xhr.responseText);
			} else {
				process(xhr);
			}
		}
	}
	xhr.open("GET", path, true);
	xhr.send();
}

function filterPages(pages, filters) {
	var result = [];

	pages.pop();
	for (var i in pages) {
		var page = pages[i];
		for (var j in filters) {
			var filter = filters[j];
			if (page.title.includes(filter) || page.url.includes(filter)) {
				if (!result.includes(page) && page.searchable) {
					result.push(page);
				}
			}
		}
	}

	return result;
}

function noResultsPage(query) {
	var description = document.getElementById("search-description");
	description.innerHTML = "'" + query + "'에 대한 검색 결과가 없습니다.";
}

function layoutResultsPage(query, pages) {
	var description = document.getElementById("search-description");
	description.innerHTML = "'" + query + "'에 대한 검색 결과입니다.";
	var container = document.getElementById("search-result");

	for (var i in pages) {
		var page = pages[i];

		var li = document.createElement("li");
		li.innerHTML = '<a href="' + page.url + '">' + page.title + '</a>';

		if (page.is_post) {
			li.innerHTML +=
			' - 카테고리: <a href="{{ site.baseurl }}/categories' + page.category + '">' + page.category_korean + '</a>'
			if (page.tag.length > 1) {
				li.innerHTML +=
				'; 태그: ';
				for (var j in page.tag) {
					var tag = page.tag[j];
					if (tag == null) {
						break;
					} else if (j != 0) {
						li.innerHTML += ', ';
					}
					li.innerHTML +=
					'<a href="{{ site.baseurl }}/tags#' + tag + '">' + tag + '</a>';
					++j;
				}
			}
		}

		container.appendChild(li);
	}
}

window.addEventListener("load", function() {
	var filters = [];
	var query = getParam("query");
	if (query == null || query == "") {
		noResultsPage("");
		return;
	}
	filters.push(query);

	getText("{{ site.baseurl }}/assets/list.json", function(data) {
		var data = JSON.parse(data);
		var pages = filterPages(data, filters);
		if (pages.length == 0) {
			noResultsPage(query);
		} else {
			layoutResultsPage(query, pages);
		}
	});
});
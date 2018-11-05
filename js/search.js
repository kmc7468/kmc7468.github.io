---
---

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
			var cur_page = null;

			if (page.title.toLowerCase().includes(filter)) {
				cur_page = page;
			} else if (page.series && page.series_has_subtitle &&
					   page.series_subtitle.toLowerCase().includes(filter)) {
				cur_page = page;
			}

			if (cur_page != null && !result.includes(cur_page)) {
				result.push(cur_page);
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
		li.innerHTML = '<a href="' + page.url + '">' + page.title_original + '</a>';

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
		} else if (page.is_series) {
			if (page.series_has_subtitle) {
				li.innerHTML += "(" + page.series_subtitle_original + ")";
			}
			li.innerHTML +=
			' - 시리즈: <a href="' + page.series_url + '">' + page.series + '</a>';
		}

		container.appendChild(li);
	}
}

function replaceAll(str, from, to) {
	return str.split(from).join(to);
}

window.addEventListener("load", function() {
	var filters = [];
	var query_original = getParam("query").toLowerCase();
	var query = query_original.trim();
	if (query == null || query == "") {
		noResultsPage("");
		return;
	}
	var query_splited = query.split(" ");
	for (var i in query_splited) {
		filters.push(query_splited[i]);
	}

	getText("{{ site.baseurl }}/assets/list.json", function(data) {
		var data = JSON.parse(data);
		var pages = filterPages(data, filters);
		if (pages.length == 0) {
			noResultsPage(query_original);
		} else {
			layoutResultsPage(query_original, pages);
		}
	});
});
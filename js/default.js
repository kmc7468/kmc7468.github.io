---
---

window.onload = function() {
	if (false || !!document.documentMode) {
		var notice_bar = document.getElementById("notice-bar");

		var notice = document.createElement("p");
		notice.innerHTML = "Internet Explorer는 지원하지 않는 브라우저입니다. Chrome 등의 다른 브라우저를 이용해 주십시오.";
		notice_bar.appendChild(notice);
	}

	var footnotes = document.getElementsByClassName("footnotes");
	var footnotes_title = document.createElement("h2");
	footnotes_title.innerHTML = "각주";
	footnotes[0].prepend(footnotes_title);

	var images = document.getElementById("main").getElementsByTagName("img");
	for (var i in images) {
		var image = images[i];
		image.title = "이미지 뷰어로 보기: " + image.alt;
		image.onclick = function() {
			var tab = window.open("{{ site.baseurl }}/assets/imageviewer?src=" + this.src, "_blank");
			tab.focus();
		}
	}
}
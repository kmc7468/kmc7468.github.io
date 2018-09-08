window.onload = function() {
	if (false || !!document.documentMode) {
		var notice_bar = document.getElementById("notice-bar");

		var notice = document.createElement("p");
		notice.innerHTML = "Internet Explorer는 지원하지 않는 브라우저입니다. Chrome 등의 다른 브라우저를 이용해 주십시오.";
		notice_bar.appendChild(notice);
	}
}
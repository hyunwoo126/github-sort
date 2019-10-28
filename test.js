(function () {
	console.log('erere');

	const reverse = (el1, el2) => {
		if (el1.innerText < el2.innerText ) {
			return 1;
		} else {
			return -1;
		}
	};
	const elems = Array.prototype.slice.call(document.getElementsByTagName('li'));
	console.log(elems);
	elems.sort(reverse);
	elems.forEach((elem) => {
		elem.parentNode.appendChild(elem);
	});
})();

// javascript:(function() {let script = document.createElement('script');script.src = 'http://localhost:8000/content.js';document.body.appendChild(script);})();
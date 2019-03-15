var button = document.querySelector(".call-form-button");
var popup = document.querySelector(".search");

if (button && popup) {
	var form = popup.querySelector("form");
	
	var arrivalDate = popup.querySelector("[name=arrivalDate]");
	var departureDate = popup.querySelector("[name=departureDate]");
	var adults = popup.querySelector("[name=adults]");
	var child = popup.querySelector("[name=child]");

	popup.classList.add("search-close");

 	form.addEventListener("submit", function (evt) {
	    if(!arrivalDate.value || !departureDate.value || !adults.value || !child.value) {
	    	evt.preventDefault();
	    	popup.classList.remove("search-error");
      		popup.offsetWidth = popup.offsetWidth;
	    	popup.classList.add("search-error");
	    } else {
	    	if(isStorageSupport) {
	    		localStorage.setItem("adults", adults.value);
		    	localStorage.setItem("child", child.value);
	    	}
     	}
	});

	var isStorageSupport = true;
	var storage = "";
	var	storage2 = "";

	try {
		storage = localStorage.getItem("adults");
		storage2 = localStorage.getItem("child");
	} catch (err) {
		isStorageSupport = false;
	}

	button.addEventListener("click", function(evt) {
		evt.preventDefault();

		popup.classList.toggle("search-close");
		popup.classList.toggle("search-show");
		popup.classList.remove("search-error");
		arrivalDate.focus();

		 if (storage) {
		 	adults.value = storage;
		 }

		 if (storage2) {
		 	child.value = storage2;
		 }
	});
}



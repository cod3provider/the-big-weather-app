export const addSpinner = elem => {
	animateBtn(elem);
	setTimeout(animateBtn, 1000, elem);
}

const animateBtn = elem => {
	elem.classList.toggle('none');
	elem.nextElementSibling.classList.toggle('block');
	elem.nextElementSibling.classList.toggle('none');
}

export const displayError = (headerMsg, srMsg) => {
	updateWeatherLocationHeader(headerMsg);
	updateScreenReaderConfirmation(srMsg);
}

const updateWeatherLocationHeader = message => {
	const h1 = document.getElementById("currentForecast__location");
	h1.textContent = message;
}

export const updateScreenReaderConfirmation = message => {
	document.getElementById("confirmation");
	confirmation.textContent = message;
}
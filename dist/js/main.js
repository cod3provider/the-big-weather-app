import {
	setLocationObject,
	getHomeLocation,
	getWeatherFromCoords,
	getCoordsFromApi,
	cleanText
} from "./dataFunctions.js";

import  {
	setPlaceholderText,
	addSpinner,
	displayError,
	displayApiError,
	updateScreenReaderConfirmation,
	updateDisplay,
} from "./domFunctions.js";

import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
	const geoBtn = document.getElementById('getLocation');
	geoBtn.addEventListener('click', getGeoWeather);
	const homeBtn = document.getElementById('home');
	homeBtn.addEventListener('click', loadWeather);
	const saveBtn = document.getElementById('saveLocation');
	saveBtn.addEventListener('click', saveLocation);
	const unitBtn = document.getElementById('unit');
	unitBtn.addEventListener('click', setUnitPref);
	const refreshBtn = document.getElementById('refresh');
	refreshBtn.addEventListener('click', refreshWeather);
	const locationEntry = document.getElementById('searchBar__form');
	locationEntry.addEventListener('submit', submitNewLocation);
	//set up
	setPlaceholderText();
	//load weather
	loadWeather();
}

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = e => {
	if (e) {
		if (e.type === 'click') {
			const mapIcon = document.querySelector('.fa-map-marker-alt');
			addSpinner(mapIcon);
		}
	}
	if (!navigator.geolocation) {
		return geoError();
	}
	navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

const geoError = errObj => {
	const errMsg = errObj ? errObj.message : "Geolocation not supported";
	displayError(errMsg, errMsg);
}

const geoSuccess = position => {
	const myCoordsObj = {
		lat: position.coords.latitude,
		lon: position.coords.longitude,
		name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
	}
//	set location object
	setLocationObject(currentLoc, myCoordsObj)
	//	update data and display
	updateDataAndDisplay(currentLoc);
}

const loadWeather = e => {
	const savedLocation = getHomeLocation();
	if (!savedLocation && !e) {
		return getGeoWeather();
	}
	if (!savedLocation && e.type === 'click') {
		displayError(
			"No Home Location Saved. ",
			"Please save your home location first."
		);
	} else if (savedLocation && !e) {
		displayHomeLocationWeather(savedLocation);
	} else {
		const homeIcon = document.querySelector('.fa-home');
		addSpinner(homeIcon);
		 displayHomeLocationWeather(savedLocation);
	}
}

const displayHomeLocationWeather = home => {
	if (typeof home === 'string') {
		const locationJson = JSON.parse(home);
		const myCoordsObj =  {
			lat: locationJson.lat,
			lon: locationJson.lon,
			name: locationJson.name,
			unit: locationJson.unit,
		};
		setLocationObject(currentLoc, myCoordsObj);
		updateDataAndDisplay(currentLoc);
	}
}

const saveLocation = () => {
	if (currentLoc.getLat() && currentLoc.getLon()) {
		const saveIcon = document.querySelector('.fa-floppy-disk');
		addSpinner(saveIcon);
		const location = {
			name: currentLoc.getName(),
			lat: currentLoc.getLat(),
			lon: currentLoc.getLon(),
			unit: currentLoc.getUnit(),
		};
		localStorage.setItem('defaultWeatherLocation', JSON.stringify(location));
		updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location.`);
	}
}

const setUnitPref = () => {
	const unitIcon = document.querySelector('.fa-chart-column');
	addSpinner(unitIcon);
	currentLoc.toggleUnit();
	updateDataAndDisplay(currentLoc);
}

const refreshWeather = () => {
	const refreshIcon = document.querySelector('.fa-arrows-rotate');
	addSpinner(refreshIcon);
	updateDataAndDisplay(currentLoc);
}

const submitNewLocation = async (e) => {
	e.preventDefault();
	const text = document.getElementById('searchBar__text').value;
	const entryText = cleanText(text);
	if (!entryText.length) {
		return
	};
	const locationIcon = document.querySelector('.fa-magnifying-glass');
	addSpinner(locationIcon);
	const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
	//	 api data
	if (coordsData) {
		if (coordsData.cod === 200) {
			//	success
			const myCoordsObj = {
				lat: coordsData.coord.lat,
				lon: coordsData.coord.lon,
				name: coordsData.sys.country
					? `${coordsData.name}, ${coordsData.sys.country}`
					: coordsData.name
			};
			setLocationObject(currentLoc, myCoordsObj);
			updateDataAndDisplay(currentLoc);
		} else {
			displayApiError(coordsData);
		}
	} else {
		displayError('Connection Error', 'Connection Error');
	}
}

const updateDataAndDisplay = async (locationObj) => {
	const weatherJson = await getWeatherFromCoords(locationObj);
	// console.log(weatherJson);
	if (weatherJson) {
		updateDisplay(weatherJson, locationObj);
	}
}
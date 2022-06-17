import { setLocationObject, getHomeLocation } from "./dataFunctions.js";
import  {
	addSpinner,
	displayError,
	updateScreenReaderConfirmation,
} from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
	const geoBtn = document.getElementById('#getLocation');
	geoBtn.addEventListener('click', getGeoWeather);
	const homeBtn = document.getElementById("home");
	homeBtn.addEventListener('click', loadWeather);
	const saveBtn = document.getElementById("saveLocation"'");
	saveBtn.addEventListener('click', saveLocation);

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
		lat: positions.coords.latitude,
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
	if (!savedLocation && e) {
		return getGeoWeather();
	}
	if (!savedLocation && e === 'click') {
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

const updateDataAndDisplay = async (locationObj) => {
	console.log(locationObj);
	// const weatherJson = await getWeatherFromCoords(locationObj);
	// if (weatherJson) {
	// 	updateDisplay(weatherJson, locationObj);
	// }
}
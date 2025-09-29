
const formatDateET = function() {
    let timeNow = new Date();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai",
	"juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];

	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const formatDayET = function() {
	let timeNow = new Date();
	const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
	return dayNamesET[timeNow.getDay()];
}

const formatTimeET = function() {
	let date = new Date();
	return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

const partOfDay = function() {
	let dayPart = "suvaline aeg";
	let hourNow = new Date().getHours();
	if (hourNow <= 6) {
		dayPart = "varahommik";
	} else if (hourNow < 12) {
		dayPart = "hommik";
	} else if (hourNow == 12) {
		dayPart = "keskpäev";
	} else if (hourNow < 18) {
		dayPart = "pärastlõuna";
	}
	return dayPart;
}

module.exports = {date: formatDateET, weekDay: formatDayET, fullTime: formatTimeET, partOfDay: partOfDay};
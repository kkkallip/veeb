
exports.formatDateET = function() {
    let timeNow = new Date();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai",
	"juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];

	const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"]

	return dayNamesET[timeNow.getDay()] + ", " + timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
    }
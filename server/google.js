const { google } = require('googleapis');

const credentials = require("./credentials.json");

const jwtClient = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key,
	['https://www.googleapis.com/auth/calendar',"https://www.googleapis.com/auth/calendar.events","https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/drive.metadata"],
	"kausik@poondit.com"
);

jwtClient.authorize(function (err, tokens) {
	if (err) {
		//console.log(err);
		return;
	} else {
		console.log("Successfully connected!",tokens);
	}
});

module.exports = jwtClient


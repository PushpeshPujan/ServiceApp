const { google } = require('googleapis');
const calendar = google.calendar('v3');
const jwtClient = require('../google')



module.exports = {
	listEvents(req, res, next) {
		return calendar.events.list({
			auth: jwtClient,
			calendarId: 'primary',
			timeMin: (new Date()).toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime',
		}, (err, response) => {
			console.log(response.data)
			return res.status(200).json(response.data)
		});
	},

	insert(req, res, next) {
		calendar.events.insert({
			auth: jwtClient,
			calendarId: 'primary',
			resource: {
				'summary': 'Google I/O 2015',
				'location': '800 Howard St., San Francisco, CA 94103',
				'description': 'A chance to hear more about Google\'s developer products.',
				'start': {
					'dateTime': '2015-05-28T09:00:00-07:00',
					'timeZone': 'America/Los_Angeles',
				},
				'end': {
					'dateTime': '2015-05-28T17:00:00-07:00',
					'timeZone': 'America/Los_Angeles',
				},
				'recurrence': [
					'RRULE:FREQ=DAILY;COUNT=2'
				],
				'attendees': [
					{ 'email': 'lpage@example.com' },
					{ 'email': 'sbrin@example.com' },
				],
				'reminders': {
					'useDefault': false,
					'overrides': [
						{ 'method': 'email', 'minutes': 24 * 60 },
						{ 'method': 'popup', 'minutes': 10 },
					],
				},
			}
		}, (err, response) => {
			return res.status(200).json(response.data)
		})
	}
}
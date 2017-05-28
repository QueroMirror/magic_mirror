/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var config = {
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses.

	language: "en",
	timeFormat: 24,
	units: "metric",
	modules: [
    {
        module: 'MMM-Hello-Mirror',
        position: 'lower_third',
	debugging: true,
        config: {
            // See 'Configuration options' for more information.
           language: "en",
           voice: "US English Female",
        }
    },
    {
    	module: 'MMM-Facial-Recognition',
    	config: {
    		// 1=LBPH | 2=Fisher | 3=Eigen
    		recognitionAlgorithm: 1,
    		// Threshold for the confidence of a recognized face before it's considered a
    		// positive match.  Confidence values below this threshold will be considered
    		// a positive match because the lower the confidence value, or distance, the
    		// more confident the algorithm is that the face was correctly detected.
    		lbphThreshold: 50,
    		fisherThreshold: 250,
    		eigenThreshold: 3000,
    		// force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
    		useUSBCam: false,
    		// Path to your training xml
    		trainingFile: 'modules/MMM-Facial-Recognition/training.xml',
    		// recognition intervall in seconds (smaller number = faster but CPU intens!)
    		interval: 1,
    		// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
    		logoutDelay: 15,
    		// Array with usernames (copy and paste from training script)
    		users: ['aissar', 'yves', 'shark', 'ricardo'],
    		//Module set used for strangers and if no user is detected
    		defaultClass: "default",
    		//Set of modules which should be shown for every user
    		everyoneClass: "everyone",
    		// Boolean to toggle welcomeMessage
    		welcomeMessage: true
    	}
    },
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_right"
		},
		{
			module: "calendar",
			header: "Quero Calendar",
			position: "top_right",
    			classes: "default everyone",
			config: {
				calendars: [
					{
						symbol: "calendar-check-o ",
						url: "/home/yves/orage_export.ics"
//						url: "http://www.calendarlabs.com/templates/ical/US-Holidays.ics"
					}
				]
			}
		},
/*		{
			module: "compliments",
			position: "lower_third"
		},*/
/*
		{
			module: "currentweather",
			position: "top_right",
			config: {
				location: "Sao Jose",
				locationID: "3448636",  //ID from http://www.openweathermap.org/help/city_list.txt
				appid: "YOUR_OPENWEATHER_API_KEY"
			}
		},
		{
			module: "weatherforecast",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				location: "Sao Jose",
				locationID: "3448636",  //ID from http://www.openweathermap.org/help/city_list.txt
				appid: "YOUR_OPENWEATHER_API_KEY"
			}
		},*/
		{
			module: "newsfeed",
			position: "bottom_bar",
    			classes: "default everyone",
			config: {
				feeds: [
					{
						title: "Reuters - WorldNews",
						url: "http://feeds.reuters.com/Reuters/worldNews"
					}
				],
				showSourceTitle: true,
				showPublishDate: true
			}
		},
		{
			module: "portugues/cumprimento",
			classes: "default everyone",
			position: "top_left"
		},
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

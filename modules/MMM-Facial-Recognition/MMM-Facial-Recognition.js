/* global Module */

/* Magic Mirror
 * Module: MMM-Facial-Recognition
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-Facial-Recognition',{

	defaults: {
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
		interval: 2,
		// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
		logoutDelay: 15,
		// Array with usernames (copy and paste from training script)
		users: [],
		//Module set used for strangers and if no user is detected
		defaultClass: "default",
		//Set of modules which should be shown for every user
		everyoneClass: "everyone",
		// Boolean to toggle welcomeMessage
		welcomeMessage: true
	},

	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
			de: "translations/de.json",
      			es: "translations/es.json",
      			zh: "translations/zh.json",
      			nl: "translations/nl.json",
			sv: "translations/sv.json",
			fr: "translations/fr.json",
			id: "translations/id.json"
		};
	},

	login_user: function () {

		Log.log('login_user: this.current_user: ' + this.current_user + ' this.config.defaultClass: ' + this.config.defaultClass)
		MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
			module.hide(1000, function() {
				Log.log('login_user: ' + module.name + ' is hidden.');
			});
		});

		MM.getModules().withClass(this.current_user).enumerate(function(module) {
			module.show(1000, function() {
				Log.log('login_user: ' + module.name + ' is shown.');
			});
		});

		this.sendNotification("CURRENT_USER", this.current_user);
	},
	logout_user: function () {

		Log.log('logout_user: this.current_user: ' + this.current_user + ' this.config.defaultClass: ' + this.config.defaultClass)
		MM.getModules().withClass(this.current_user).enumerate(function(module) {
			module.hide(1000, function() {
				Log.log('logout_user: ' + module.name + ' is hidden.');
			});
		});

		MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
			module.show(1000, function() {
				Log.log('logout_user: ' + module.name + ' is shown.');
			});
		});

		this.sendNotification("CURRENT_USER", "None");
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		Log.info('socketNotificationReceived action: ' + payload.action)
		if (payload.action == "login"){
			Log.info('socketNotificationReceived login')
			if (this.current_user_id != payload.user){
				this.logout_user()
			}
			if (payload.user == -1){
				this.current_user = this.translate("stranger")
				this.current_user_id = payload.user;
				this.sendNotification("STRANGE_CAME")
				this.sendNotification("SHOW_ALERT", {type: "notification", message: this.translate("hello_guest_message")});
				this.sendNotification("SHOW_ALERT", {type: "notification", message: "Gostaria de falar com alguém?" } );
			}
			else{
				this.current_user = this.config.users[payload.user];
				this.current_user_id = payload.user;
				this.login_user()
				this.sendNotification("EMPLOYEE_CAME", this.current_user)
			
				if (this.config.welcomeMessage) {
					selected_message = Math.ceil(Math.random() * 3)
					Log.log("WELCOME RAND: " + selected_message);
					this.sendNotification("SHOW_ALERT", {type: "notification", message: this.translate("hello_message_" + selected_message).replace("%person", this.current_user)});					
				}
			}
		}
		else if (payload.action == "logout"){
			this.logout_user()
			this.current_user = null;
		}
	},

	notificationReceived: function(notification, payload, sender) {
		Log.log('notificationReceived: ' + notification);
		if (notification === 'DOM_OBJECTS_CREATED') {
			//tudo que nao for default sera escondido na criacao			
			MM.getModules().exceptWithClass("default").enumerate(function(module) {
				module.hide(1000, function() {
					Log.log('Module is hidden.');
				});
			});

		}
		if (notification === 'NEW_USER_CAPTURE') {
			Log.log('NEW_USER_CAPTURE RECEIVED');

			fs = require('fs')
			fs.readFile('./face.pid', 'utf8', function (err,data) {
			  if (err) {
			    return console.log(err);
			  }
			  Log.log("NEW_USER_CAPTURE PID DATA: " + data);
			});

			const spawn = require('child_process').spawn;
			const ls = spawn('kill', ['-USR1', '6948']);
		}
	},

	start: function() {
	  Log.log("$$$$$$$$$$$$$$$$ facial-mirror start %%%%%%%%%%%%%%%%%%%%")
		this.current_user = null;
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}

});

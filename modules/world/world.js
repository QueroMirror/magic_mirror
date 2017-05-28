//helloworld.js:

Module.register("world",{
	// Default module config.
	defaults: {
		text: "Hello World!",
		hidden: false
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
		return wrapper;
	},

	notificationReceived: function(notification, payload, sender) {
		Log.log('notificationReceived: ' + notification);
		if (notification === 'EMPLOYEE_CAME') {
			Log.log("STRANGE!!!!")
		}
		if (notification === 'STRANGE_CAME') {
			Log.log("QUERO FELLOW!!!!")
		}
	}
});

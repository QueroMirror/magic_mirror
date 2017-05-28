/* global Module */

/* Magic Mirror
 * Module: NewsFeed
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

 /* global Module */

 /* Magic Mirror
  * Module: HelloWorld
  *
  * By Michael Teeuw http://michaelteeuw.nl
  * MIT Licensed.
  */

Module.register("cumprimento",{

  // Load required additional scripts
	getScripts: function() {
		return [
			'//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js',     // annyang! SpeechRecognition
			'http://code.responsivevoice.org/responsivevoice.js',                // ResponsiveVoice
			'moment.js'                                                          // Parse, validate, manipulate, and display dates in JavaScript
		];
	},

  start: function() {
    // var self = this;
    Log.info("Module name: " + this.name);
  },

  notificationReceived: function(notification, payload, sender) {
		Log.info(this.name + " - received notification: " + notification);
    Log.info(this.name + " - received payload: " + payload);
    // Log.info(this.name + " - received sender: " + JSON.stringify(sender));

    if (notification == "EMPLOYEE_CAME") {
      if (responsiveVoice) {
          responsiveVoice.speak( "Olá " + payload );
      }
    }

    if (notification == "STRANGE_CAME") {
      if (responsiveVoice) {
          responsiveVoice.speak( "Olá visitante, bem vindo a quero");
      }
    }
  },


});

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

    defaults: {
      state: 0
    },
    /*
    states:
    0 - no one
    1 - employee - > final state
    2 - guest -> initial guest state ( wanna talk someone? )
    3 - how?
    4 - user selected

    5 - wait for response?
    */

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

    if (this.state == 0) {
      if (notification == "EMPLOYEE_CAME") {
        if (responsiveVoice) {
            this.state = 1;
            responsiveVoice.speak( "Olá " + payload );
        }
      }

      if (notification == "STRANGE_CAME") {
        if (responsiveVoice) {
            this.state = 2;
            responsiveVoice.speak( "Olá visitante, bem vindo a quero educação. Gostaria de falar com alguém?");
        }
      }
    }
    if (this.state == 2) {
      Log.info(this.name + " - received command");
      if (notification == "VOICE_COMMAND_YES") {
        Log.info(this.name + " - SIM, quer falar com alguem!");
        responsiveVoice.speak( "Com quem você gostaria de falar.");
        this.state = 4;
      }
      if (notification == "VOICE_COMMAND_NO") {
        Log.info(this.name + " - NAO, nao quer falar com alguem!");
        responsiveVoice.speak( "Tudo bem, a Márcia pode te ajudar.");
        this.state = 0;
      }
    }
    if (this.state == 2 || this.state == 4) {
      if (notification == "VOICE_COMMAND_RICARDO") {
        responsiveVoice.speak( "Ok, vou procurar o Ricardo e avisar que você está aqui.");
        this.state = 0;
      }
    }

  },

});

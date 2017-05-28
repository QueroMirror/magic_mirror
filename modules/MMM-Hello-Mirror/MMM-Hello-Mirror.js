/* Magic Mirror
 * Module: MMM-Hello-Mirror
 *
 * By Mathias Kaniut
 * MIT Licensed
 */

Module.register("MMM-Hello-Mirror", {

	// Default module config.
    defaults: {
        language: "en",
        voice: "US English Female",
        wakeUp: "Hi (magic) mirror",
        animationSpeed: 2000,
        debug: true,
        broadcastEvents: true
    },

	// Load required additional scripts
	getScripts: function() {
		return [
			'//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js',     // annyang! SpeechRecognition
			'http://code.responsivevoice.org/responsivevoice.js',                // ResponsiveVoice
			'moment.js'                                                          // Parse, validate, manipulate, and display dates in JavaScript
		];
	},

	// Define additional styles
	getStyles: function() {
		return [
			"font-awesome.css",
			this.file('css/MMM-Hello-Mirror.css')
		];
	},

	// Request translation files
	getTranslations: function() {
        return {
            en: "translations/en.json",
            de: "translations/de.json",
            pt: "translations/pt.json",
            pt_br: "translations/pt_br.json",
		};
	},

    textMessage: "",

	// Called when all modules are loaded an the system is ready to boot up
	start: function() {
		Log.info("$$$$$$$$$$$$$$$$ Hello-mirror start %%%%%%%%%%%%%%%%%%%%")
    if (responsiveVoice) {
			responsiveVoice.setDefaultVoice(this.config.voice);
		}

		if (annyang) {
            Log.info("Starting module: " + this.name);

            var self = this;

			// Set language for date object
			moment.locale(this.config.language);

			// Set the debug mode
			annyang.debug(this.config.debug);

			// Set the language of annyang
			annyang.setLanguage(this.config.language);

			// Define the commands ...
            // ... for german language
            if (self.config.language == 'de') {
                var commands = {
                    'Hallo (magischer) Spiegel *command': function(command) {
                        Log.info('Voice command recognized in module ' + self.name + ': ' + command);
                        if (self.config.broadcastEvents) {
                            self.sendNotification("VOICE_COMMAND", command);
                        }
                        if (responsiveVoice) {
                            responsiveVoice.speak( self.translate("VOICE_ACCEPTED") );
                        }
                    }
                };
            // ... for other languages (should be english)
          } else if (self.config.language == 'en') {
                var commands = {
                    'Hi (magic) mirror *command': function(command) {
                        Log.info('Voice command recognized in module ' + self.name + ': ' + command);
                        if (self.config.broadcastEvents) {
                            self.sendNotification("VOICE_COMMAND", command);
                        }
                        if (responsiveVoice) {
                            console.log("VOICE_ACCEPTED")
                            responsiveVoice.speak( self.translate("VOICE_ACCEPTED") );
                        }
                    }
                };
            } else if (self.config.language == 'pt_br') {
                  var commands = {
                      'Espelho (mágico) *command': function(command) {
                          Log.info('Voice command recognized in module ' + self.name + ': ' + command);
                          if (self.config.broadcastEvents) {
                              self.sendNotification("VOICE_COMMAND", command);
                          }
                          if (responsiveVoice) {
                              console.log("VOICE_ACCEPTED")
                              // responsiveVoice.speak( self.translate("VOICE_ACCEPTED") );
                          }
                      },
                      'Sim': function() {
                          Log.info('Sim ' + self.name);
                          if (self.config.broadcastEvents) {
                              self.sendNotification("VOICE_COMMAND_YES", "Sim");
                          }
                          if (responsiveVoice) {
                              console.log("VOICE_ACCEPTED_YES")
                              responsiveVoice.speak( "Entendi, Sim" );
                          }
                      },
                      'Não': function() {
                          Log.info('Não ' + self.name);
                          if (self.config.broadcastEvents) {
                              self.sendNotification("VOICE_COMMAND_NO", "Não");
                          }
                          if (responsiveVoice) {
                              console.log("VOICE_ACCEPTED_NO")
                              // responsiveVoice.speak( self.translate("VOICE_ACCEPTED_NO") );
                              responsiveVoice.speak( "Entendi, Não" );
                          }
                      },
                      'Ricardo': function() {
                          Log.info('Ricardo ' + self.name);
                          if (self.config.broadcastEvents) {
                              self.sendNotification("VOICE_COMMAND_RICARDO", "Ricardo");
                          }
                          if (responsiveVoice) {
                              console.log("VOICE_COMMAND_RICARDO")
                              responsiveVoice.speak( "Entendi, Ricardo" );
                          }
                      }
                      'Michael Douglas': function() {
                          Log.info('Michael Douglas ' + self.name);
                          if (self.config.broadcastEvents) {
                              self.sendNotification("MICHAEL_DOUGLAS", "Nunca mais eu vou dormir!");
                          }
                          if (responsiveVoice) {
                              console.log("MICHAEL_DOUGLAS")
                              // responsiveVoice.speak( self.translate("VOICE_ACCEPTED_NO") );
                              responsiveVoice.speak( "Qué isso? Nunca mais eu vou dormir! Nunca mais eu vou dormir!" );
                          }
                      }
                  };
              }

			// Add the commands to annyang
  		annyang.addCommands(commands);

			// Add callback functions for errors
			annyang.addCallback('error', function() {
				Log.error('ERROR in module ' + self.name + ': ' + 'Speech Recognition fails because an undefined error occured');
			});
			annyang.addCallback('errorNetwork', function() {
		    		Log.error('ERROR in module ' + self.name + ': ' + 'Speech Recognition fails because of a network error');
			});
			annyang.addCallback('errorPermissionBlocked', function() {
		    		Log.error('ERROR in module ' + self.name + ': ' + 'Browser blocks the permission request to use Speech Recognition');
			});
			annyang.addCallback('errorPermissionDenied', function() {
		    		Log.error('ERROR in module ' + self.name + ': ' + 'The user blocks the permission request to use Speech Recognition');
			});
			annyang.addCallback('resultNoMatch', function(phrases) {
				Log.error('ERROR in module ' + self.name + ': ' + 'No match for voice command ' + phrases);
			});
			annyang.addCallback('soundstart', function() {
				Log.info("soundstart# HEAR_YOU")
        self.textMessage = self.translate("HEAR_YOU");
  				self.updateDom(self.config.animationSpeed);
			});
			annyang.addCallback('result', function() {
				self.textMessage = "";
  				self.updateDom(self.config.animationSpeed);
			});

			// Start listening
			annyang.start();
		} else {
			Log.error('ERROR in module ' + self.name + ': ' + 'Google Speech Recognizer is down :(');
		}
	},

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "small light";
        wrapper.innerHTML = this.textMessage;
        return wrapper;
    },
});

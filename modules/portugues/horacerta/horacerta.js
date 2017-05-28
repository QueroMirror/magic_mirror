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

Module.register("horacerta",{

  start: function() {
    // var self = this;
    Log.info("Module name: " + this.name);
  },

  notificationReceived: function(notification, payload, sender) {
		Log.info(this.name + " - received notification: " + notification);
    Log.info(this.name + " - received payload: " + payload);
    // Log.info(this.name + " - received sender: " + JSON.stringify(sender));
  },


});

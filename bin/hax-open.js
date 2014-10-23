var jsdom = require("jsdom");
var open = require("open");

var url = "http://haxfred.hax10m.com/extras/loglinks";

jsdom.env(
   url,
   function ( errors, window ) {
      if (errors) {
         console.log("Errors: ");
         console.log(errors);
      } else {
         var $ = require('jquery')(window);
         open($('.irc-link').first().find('.article').attr('href'));
      }
   }
);

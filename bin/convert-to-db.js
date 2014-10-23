var jsdom = require("jsdom");
var request = require("request");

var url = "http://haxfred.hax10m.com/extras/loglinks";

jsdom.env(
   url,
   function ( errors, window ) {
      if (errors) {
         console.log("Errors: ");
         console.log(errors);
      } else {
         console.log('Links downloaded');

         var $ = require('jquery')(window);

         function post_article(el) {
            var href = $( el ).find('.article').attr('href'),
                user;

            if ( $(el).find('.postMessage').text().match(/:/) ) {
               var postMessage = $(el).find('.postMessage').text().match(/^(.*?)(: )(.*)/);
               user = postMessage[1];
               caption = postMessage[3];
               console.log(postMessage);
            } else {
               user = $(el).find('.postMessage').text();
               caption = '';
            }

            post_link({
               url: href,
               user: user,
               caption: caption 
            })
         }
         function post_link(data) {
            console.log('Creating: ' + data.url);
            request.post(
               'http://localhost:3000/api/links',
               { form: data },
               function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                     console.log('✓ ' + data.url);
                  } else {
                     console.log('✗ ' + data.url);
                  }
               }
            );
         }
         $.each($('.irc-link'), function(i, el) {
            if ( $( el ).find('.article').length > 0 ) {
               post_article(el);
            }
         });
      }
   }
);

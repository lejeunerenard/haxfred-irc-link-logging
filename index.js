var express  = require('express'),
  Sequelize  = require('sequelize-sqlite').sequelize,
  sqlite     = require('sequelize-sqlite').sqlite,
  restful    = require('sequelize-restful'),
  sequelize  = new Sequelize('linkLogs','seanz','', {
     dialect: 'sqlite',
     storage: 'data.db',
  }),
  bodyParser = require('body-parser'),
  app        = express();

var port = process.env.PORT || 3000;

// define all your models before the configure block
var Link = sequelize.define('link', {
  url: Sequelize.STRING,
  type: Sequelize.ENUM('image', 'youtube', 'vimeo', 'article'),
  caption: Sequelize.STRING,
  user: Sequelize.STRING
});

sequelize.sync().complete(function(err) {
   if (!!err) {
      console.log('An error occurred while creating the table:', err);
   } else {
      console.log('Schema synched');
   }
});

app.use(bodyParser.urlencoded({ extended: false  }));

function parseReq(req, model) {
   var query = {};
   // Loop through all the parameters in the request's query
   for ( param in req.query ) {
      console.log("match: " + param.match(/^_/));
      // Non where parameters start with _
      if ( param.match(/^_/) ) {
         switch ( param ) {
            case "_limit":
               query.limit = req.query._limit;
            case "_offset":
               query.offset = req.query._offset;
               break;
         }
      // Check model or throw error.
      //} else if ( !!model ) {
      //   query.where = query.where || {};
      //   query.where[param] = req.query[param];
      // Try it anyways ;)
      } else {
         query.where = query.where || {};
         query.where[param] = req.query[param];
      }
   }
   return query;
}

app.get('/api/links/', function (req, res) {
   var query = parseReq(req, Link);
   Link.findAll(query).success(function(entries) {
      entries = entries.map(function(entry) { return entry.values  })
      res.json(entries);
   }.bind(this))
   // @TODO Better Error response
   .error(function(error) {
      res.json({
         status: "error",
         error: error
      });
   });
});
app.get('/api/links/:id', function (req, res) {
   Link.find(req.params.id).success(function(entry) {
      res.json(entry.values);
   }.bind(this));
});

app.post('/api/links', function (req, res) {
   Link.create(req.body).success(function(link) {
      res.json(link.values)
   })
});

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
});

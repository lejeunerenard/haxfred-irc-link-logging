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

app.get('/api/links/', function (req, res) {
   Link.findAll({}).success(function(entries) {
      entries = entries.map(function(entry) { return entry.values  })
      res.json(entries);
   }.bind(this));
});
app.get('/api/links/:id', function (req, res) {
   if ( req.params.id ) {
      Link.find(req.params.id).success(function(entry) {
         res.json(entry.values);
      }.bind(this));
   } else {
      Link.findAll({}).success(function(entries) {
         entries = entries.map(function(entry) { return entry.values  })
         res.json(entries);
      }.bind(this));
   }
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

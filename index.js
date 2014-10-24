var express  = require('express'),
  Sequelize  = require('sequelize-sqlite').sequelize,
  sqlite     = require('sequelize-sqlite').sqlite,
  restful    = require('sequelize-restful'),
  sequelize  = new Sequelize('linkLogs','seanz','', {
     dialect: 'sqlite',
     storage: 'data.db',
  }),
  app        = express();

var port = process.env.PORT || 3000;

// define all your models before the configure block
var Link = sequelize.define('link', {
  url: Sequelize.STRING,
  type: Sequelize.ENUM('image', 'youtube', 'vimeo', 'article'),
  caption: Sequelize.STRING,
  user: Sequelize.STRING
});

sequelize.sync({ force: true }).complete(function(err) {
   if (!!err) {
      console.log('An error occurred while creating the table:', err);
   } else {
      console.log('Schema synched');
   }
});

app.use(restful(sequelize));

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
});

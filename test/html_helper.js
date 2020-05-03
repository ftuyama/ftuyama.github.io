var fs = require('fs');
var Crawler = require("crawler");

function loadPage(callback) {
  fs.readFile('index.html', 'utf8', function(err, page) {
    if (err) throw err;
      new Crawler().queue([{
      html: page,
      callback: function (err, res, _done) {
        if (err) throw err;
        callback(page, res.$);
      }
    }]);
  });
}

module.exports = loadPage;

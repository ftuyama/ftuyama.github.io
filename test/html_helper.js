const fs = require('fs');
const Crawler = require('crawler');

function loadPage(callback) {
  fs.readFile('index.html', 'utf8', (err, page) => {
    if (err) throw err;
    new Crawler().queue([{
      html: page,
      callback(error, res) {
        if (error) console.log(error);
        callback(page, res.$);
      },
    }]);
  });
}

module.exports = loadPage;

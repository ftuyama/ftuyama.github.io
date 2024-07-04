const fs = require('fs');

async function loadPage(callback) {
  const { default: Crawler } = await import('crawler');

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

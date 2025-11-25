import fs from 'fs';
// eslint-disable-next-line import/no-unresolved
import Crawler from 'crawler';

function loadPage(callback) {
  fs.readFile('index.html', 'utf8', (err, page) => {
    if (err) throw err;
    new Crawler().queue([{
      html: page,
      callback(error, res) {
        // eslint-disable-next-line no-console
        if (error) console.log(error);
        callback(page, res.$);
      },
    }]);
  });
}

export default loadPage;

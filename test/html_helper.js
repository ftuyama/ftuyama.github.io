import { readFile } from 'fs/promises';
import Crawler from 'crawler';

export default async function loadPage() {
  const page = await readFile('index.html', 'utf8');
  return new Promise((resolve, reject) => {
    new Crawler().queue([{
      html: page,
      callback(error, res) {
        if (error) return reject(error);
        return resolve({ page, $: res.$ });
      },
    }]);
  });
}

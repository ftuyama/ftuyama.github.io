import assert from 'assert';
import { readFile } from 'fs/promises';
import loadPage from './html_helper.js';

describe('SEO', () => {
  describe('robots.txt', () => {
    let robots;

    before(async () => {
      robots = await readFile('static/robots.txt', 'utf8');
    });

    it('should declare the sitemap', () => {
      assert.match(robots, /Sitemap:\s*https:\/\/ftuyama\.github\.io\/sitemap\.xml/);
    });

    it('should disallow certificate PDFs', () => {
      assert.match(robots, /Disallow:\s*\/public\/certificates\//);
    });

    it('should allow the site root', () => {
      assert.match(robots, /Allow:\s*\//);
    });
  });

  describe('llms.txt', () => {
    let llms;

    before(async () => {
      llms = await readFile('static/llms.txt', 'utf8');
    });

    it('should start with an H1 for the site name', () => {
      assert.ok(llms.startsWith('# Felipe Tuyama'));
    });

    it('should have a blockquote summary after the H1', () => {
      const lines = llms.split('\n');
      assert.equal(lines[0], '# Felipe Tuyama');
      assert.ok(lines[2].startsWith('> '));
    });

    it('should use absolute https URLs', () => {
      const links = [...llms.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1]);
      assert.ok(links.length > 0, 'expected at least one markdown link');
      for (const url of links) {
        assert.ok(url.startsWith('https://'), `${url} should be an absolute https URL`);
      }
    });

    it('should reference /public/cache/ paths, not /static/public/', () => {
      assert.match(llms, /\/public\/cache\//);
      assert.doesNotMatch(llms, /\/static\/public\//);
    });
  });

  describe('sitemap.xml', () => {
    let sitemap;

    before(async () => {
      sitemap = await readFile('static/sitemap.xml', 'utf8');
    });

    it('should be valid XML with a urlset', () => {
      assert.match(sitemap, /<\?xml\s/);
      assert.match(sitemap, /<urlset[\s>]/);
      assert.match(sitemap, /<\/urlset>/);
    });

    it('should list the canonical homepage URL', () => {
      assert.match(sitemap, /<loc>https:\/\/ftuyama\.github\.io\/<\/loc>/);
    });
  });

  describe('index.html metadata', () => {
    let $;

    before(async () => {
      ({ $ } = await loadPage());
    });

    it('should have a canonical link', () => {
      assert.equal($('link[rel="canonical"]').attr('href'), 'https://ftuyama.github.io/');
    });

    it('should have Open Graph title', () => {
      assert.equal(
        $('meta[property="og:title"]').attr('content'),
        'Felipe Tuyama | Senior Software Engineer',
      );
    });

    it('should have a Twitter card', () => {
      assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image');
    });

    it('should include Person structured data', () => {
      const raw = $('script[type="application/ld+json"]').html();
      assert.ok(raw, 'expected JSON-LD script');
      const data = JSON.parse(raw);
      const nodes = data['@graph'] || [data];
      const person = nodes.find((n) => n['@type'] === 'Person');
      assert.ok(person, 'expected a Person node in JSON-LD');
      assert.equal(person.name, 'Felipe Tuyama');
    });
  });
});

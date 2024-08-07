import assert from 'assert';
import urlExists from 'url-exists';
import loadPage from './html_helper.js';

describe('Page', () => {
  let page; let $; let links; let
    imgs;

  before((done) => {
    loadPage((pageHTML, pageObj) => {
      page = pageHTML;
      $ = pageObj;
      done();
    });
  });

  describe('#page', () => {
    it('should exist', () => {
      assert.equal(true, !!page);
    });

    it('should have title', () => {
      assert.equal('Felipe Tuyama | Senior Software Engineer', $('title').text(), 'Invalid page title');
    });
  });

  describe('#links', () => {
    before((done) => {
      links = $('a');
      done();
    });

    it('should have target blank', () => {
      links.each((i, link) => {
        if (!link.attribs.href.match(/.*(resume|infinitusgo|google|twitter|#).*/)) {
          // console.log(link.attribs.href);
          assert.equal('_blank', link.attribs.target, `${link.attribs.href} should have target _blank`);
        }
      });
    });

    it('should be valid', () => {
      links.each((i, link) => {
        if (!link.attribs.href.match(/.*(resume|buson|teaminternational|google|infinitusgo|linkedin|vigil|twitter|researchgate|stackoverflow|#).*/)) {
          urlExists(link.attribs.href, (err, exists) => {
            if (err) throw err;
            assert.equal(true, exists, `${link.attribs.href} no longer exists`);
          });
        }
      });
    });
  });

  describe('#images', () => {
    before((done) => {
      imgs = $('img');
      done();
    });

    it('should have lazy loading', () => {
      imgs.each((i, img) => {
        assert.equal('lazy', img.attribs.loading, `${img.attribs.src} should have lazy load`);
      });
    });
  });
});

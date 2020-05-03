var assert = require('assert');
var urlExists = require('url-exists');
var loadPage  = require('./html_helper');

describe('Page', function() {
  before(function(done){
    loadPage(function(pageHTML, pageObj) {
      page = pageHTML;
      $ = pageObj;
      done();
    })
  });

  describe('#page', function() {
    it('should exist', function() {
      assert.equal(true, !!page);
    });

    it('should have title', function() {
      assert.equal('Felipe Tuyama', $('title').text(), 'Invalid page title');
    });
  });

  describe('#links', function() {
    before(function(done){
      links = $('a');
      done();
    });

    it('should have target blank', function() {
      links.each(function(i, link) {
        if (!link.attribs.href.match(/.*(resume|google|#).*/)) {
          // console.log(link.attribs.href);
          assert.equal('_blank', link.attribs.target, `${link.attribs.href} should have target _blank`);
        }
      });
    });

    it('should be valid', function() {
      links.each(function(i, link) {
        if (!link.attribs.href.match(/.*(resume|google|vigil|#).*/)) {
          urlExists(link.attribs.href, function(err, exists) {
            if (err) throw err;
            assert.equal(true, exists, `${link.attribs.href} no longer exists`);
          });
        }
      });
    });
  });
});

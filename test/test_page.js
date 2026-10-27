import assert from 'assert';
import loadPage from './html_helper.js';

const SKIP_BLANK_PATTERN = /.*(resume|infinitusgo|google|twitter|#).*/;

describe('Page', () => {
  let page;
  let $;
  let links;
  let imgs;

  before(async () => {
    ({ page, $ } = await loadPage());
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
    before(() => {
      links = $('a');
    });

    it('should have target blank', () => {
      links.each((_i, link) => {
        if (!link.attribs.href.match(SKIP_BLANK_PATTERN)) {
          assert.equal('_blank', link.attribs.target, `${link.attribs.href} should have target _blank`);
        }
      });
    });
  });

  describe('#images', () => {
    before(() => {
      imgs = $('img');
    });

    it('should have lazy loading', () => {
      imgs.each((_i, img) => {
        assert.equal('lazy', img.attribs.loading, `${img.attribs.src} should have lazy load`);
      });
    });
  });

  describe('#portfolio', () => {
    const projects = [
      'git-light',
      'arcania',
      'silent-dungeon',
      'google-reauth-extension',
      'scroll-closing-your-eyes',
      'flaky-rspec-reporter',
    ];

    it('should show the selected GitHub projects', () => {
      assert.equal(undefined, $('#portfolio').attr('hidden'));
      assert.equal(projects.length, $('.project-card').length);

      projects.forEach((project) => {
        const card = $('.project-card').filter((_i, el) =>
          $(el).find('h3').text() === project,
        );
        assert.equal(1, card.length, `Missing ${project} project card`);
        assert.equal(
          `https://github.com/ftuyama/${project}`,
          card.find('a').first().attr('href'),
        );
      });
    });

    it('should only show demos for projects with a homepage', () => {
      assert.equal(4, $('.project-links a').filter((_i, el) => $(el).text().includes('Demo')).length);
    });

    it('should keep certificates hidden', () => {
      assert.equal('hidden', $('.certificates').attr('hidden'));
    });
  });
});

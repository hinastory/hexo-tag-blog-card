/**
* hexo-tag-blog-card
*
* Copyright (c) 2019, hinastory
* Licensed under the MIT license.
* Syntax:
* {% blogCard https://www.amazon.com/ %}
**/

'use strict';
const util = require('hexo-util');
const ogs = require('open-graph-scraper');
const escapeHTML = require('escape-html');
const querystring = require('querystring');
const descriptionLength = (hexo.config.blogCard && hexo.config.blogCard.descriptionLength)
                            ? hexo.config.blogCard.descriptionLength : 140;
const className = (hexo.config.blogCard && hexo.config.blogCard.className)
                    ? hexo.config.blogCard.className : 'blog-card';

hexo.extend.tag.register('blogCard', function(args) {
  return getTag({url: args[0], target: args[1], rel: args[2]}).then(tag => {
    return tag;
  });
}, {async: true});

async function getTag(options) {
  return ogs(options)
    .then(function (result) {
      const ogp = result.data;
      let image = '';
      let contents = '';
      let info = ''

      if (ogp.hasOwnProperty('ogSiteName')) {
        const siteName = util.htmlTag('div', { class: 'hbc-site-name' }, escapeHTML(ogp.ogSiteName));
        const faviconUrl = 'https://cdn-ak.favicon.st-hatena.com/?url=' + encodeURIComponent(options.url);
        const favicon = util.htmlTag('img', { class: 'hbc-favicon', src: faviconUrl } , '');
        info = util.htmlTag('div', { class: 'hbc-info' }, favicon + siteName);
      }

      if (ogp.hasOwnProperty('ogImage')) {
        image += util.htmlTag('img', { src: ogp.ogImage.url } , '');
        contents = util.htmlTag('div', { class: 'hbc-thumbnail'}, image)
      }

      contents += util.htmlTag('div', { class: 'hbc-title' }, escapeHTML(ogp.ogTitle));
      contents += util.htmlTag('div', { class: 'hbc-url' }, options.url);

      if (ogp.hasOwnProperty('ogDescription')) {
        const description = adjustLength(ogp.ogDescription);
        contents += util.htmlTag('div', { class: 'hbc-description' }, escapeHTML(description));
      }

      const contentsTag = util.htmlTag('div', { class: 'hbc-contents' },  contents);
      const card = util.htmlTag('div', { class: 'hbc-card' }, info + contentsTag);
      const link = util.htmlTag('a', { class: 'hbc-link', href: options.url, target: options.target, rel: options.rel }, card);
      const linkWrap = util.htmlTag('div', { class: 'hbc-link-wrap' }, link);
      const tag = util.htmlTag('div', { class: className }, linkWrap);
      return tag;
    })
    .catch(function (error) {
      console.log('error:', error);
      return '';
  });
}

function adjustLength(description) {
  if (description && description.length > descriptionLength) {
    description = description.slice(0, descriptionLength) + '…';
  }
  return description;
}

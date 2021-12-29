/**
* hexo-tag-blog-card
*
* Copyright (c) 2019, hinastory
* Licensed under the MIT license.
* Syntax:
* {% blogCard <url> [rel:<rel>] [target:<target>] [useHatena:<true/false>] %}
**/

'use strict';
const util = require('hexo-util');
const ogs = require('open-graph-scraper');
const escapeHTML = require('escape-html');
const url = require('url');
const descriptionLength = (hexo.config.blogCard && hexo.config.blogCard.descriptionLength)
                            ? hexo.config.blogCard.descriptionLength : 140;
const className = (hexo.config.blogCard && hexo.config.blogCard.className)
                    ? hexo.config.blogCard.className : 'blog-card';
const faviconAPI = (hexo.config.blogCard && hexo.config.blogCard.faviconAPI)
                    ? hexo.config.blogCard.faviconAPI : 'http://favicon.hatena.ne.jp/?url=$URL';
const useHatena = (hexo.config.blogCard && hexo.config.blogCard.useHatena)
                    ? hexo.config.blogCard.useHatena : false;
const timeout = (hexo.config.blogCard && hexo.config.blogCard.timeout)
                    ? hexo.config.blogCard.timeout : 6000;

hexo.extend.tag.register('blogCard', function(args) {
  return getTag(parseOption(args));
}, { async: true });


function parseOption(args) {
  let opts = { url: args[0], timeout };

  if (args.length > 1) {
    args.slice(1).forEach((e) => {
      let [name, val] = e.split(':');
      if (name == 'target' || name == 'rel' || name == 'hatena') {
        opts[name] = val;
      }
    });
  }
  return opts;
}

function getTag(options) {
  if (options.hatena) {
    if (options.hatena == 'true') {
      return getTagByHatena(options);
    } else if (options.hatena == 'false') {
      return getTagByOpenGraph(options);
    }
  } else if (useHatena) {
    return getTagByHatena(options);
  } else {
    return getTagByOpenGraph(options);
  }
}

function getTagByHatena(options) {
  return new Promise((resolve) => {
    resolve(`<iframe class="${className}" style="width: 100%; height: 155px; max-width: 500px;" src="https://hatenablog-parts.com/embed?url=${options.url}"></iframe>`);
  })
}

function getCardTag(ogp, options){
  const info = getInfo(options, ogp);
  const contents = getContents(options, ogp);

  const card = util.htmlTag('div', { class: 'hbc-card' }, info + contents);
  const link = util.htmlTag('a', { class: 'hbc-link', href: options.url, target: options.target, rel: options.rel }, card);
  const linkWrap = util.htmlTag('div', { class: 'hbc-link-wrap' }, link);
  const tag = util.htmlTag('div', { class: className }, linkWrap);
  return tag;
}

function getTagByOpenGraph(options){
  return ogs(options)
     .then(function(result){
        return getCardTag(result.data, options);
     })
    .catch(function (err) {
        const {error, requestUrl, errorDetails} = err;
//        console.log({error, requestUrl, errorDetails});
        options.faviconAPI = "http://www.google.com/s2/favicons?domain=$DOMAIN"
        return getCardTag({ogTitle: options.url}, options);
    });
}

function getInfo(options, ogp) {
  let name = '';
  const urlParsed = url.parse(options.url);

  if (ogp.hasOwnProperty('ogSiteName')) {
    name = ogp.ogSiteName;
  } else {
    name = urlParsed.hostname;
  }

  const siteName = util.htmlTag('div', { class: 'hbc-site-name' }, escapeHTML(name));

  let api = faviconAPI;
  if (options.hasOwnProperty('faviconAPI')) {
    api = options.faviconAPI;
  }
  api = api.replace('$DOMAIN', encodeURIComponent(urlParsed.hostname));
  api = api.replace('$URL', encodeURIComponent(options.url));
  const favicon = util.htmlTag('img', { class: 'hbc-favicon', src: api } , '');
  return util.htmlTag('div', { class: 'hbc-info' }, favicon + siteName);
}

function getContents(options, ogp) {
  let contents = '';
  let text = '';

  if (ogp.hasOwnProperty('ogImage')) {
    const image = util.htmlTag('img', { src: ogp.ogImage.url } , '');
    contents = util.htmlTag('div', { class: 'hbc-thumbnail' }, image);
  }

  text += util.htmlTag('div', { class: 'hbc-title' }, escapeHTML(ogp.ogTitle));
  text += util.htmlTag('div', { class: 'hbc-url' }, options.url);

  if (ogp.hasOwnProperty('ogDescription')) {
    const description = adjustLength(ogp.ogDescription);
    text += util.htmlTag('div', { class: 'hbc-description' }, escapeHTML(description));
  }
  contents += util.htmlTag('div', { class: 'hbc-text' }, text);

  return util.htmlTag('div', { class: 'hbc-contents' },  contents);
}

function adjustLength(description) {
  if (description && description.length > descriptionLength) {
    description = description.slice(0, descriptionLength) + '…';
  }
  return description;
}

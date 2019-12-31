# hexo-tag-blog-card
Embed a blog card on your [Hexo](https://hexo.io/) article.

[![hexo](https://img.shields.io/badge/Hexo-%3E%3D3.0-blue.svg?style=flat-square)](https://hexo.io)

## Installation

`npm install hexo-tag-blog-card`

## Usage
`{% blogCard <url> [target:<target>] [rel:<rel>] [hatena:<true/false>] %}`

Example:
```
{% blogCard https://www.amazon.com/ _blank nofollow %}
```

### Explantion of attributes

1. url - An URL for the link. Required.
1. target attribute - if you need to open link with another window, you must set here "_blank".
1. rel attribute - if you need to link with rel="nofollow", set here "nofollow".
1. hatena - if you can use Hatena Blog Card, set "true" (default: use global settings(`useHatena`))

Target attribute and rel attribute can be abbreviated. But if only target attribute abbreviated, will not work correctly.

If you need to open same window and set rel="nofollow", please write down like below.

## Options
### className
You can provide top-level class name of this preview link HTML.
(Default: `blog-card`)

### descriptionLength
You can provide number of character in og-description.
(Default: `140`)

### faviconAPI
You can provide a favicon API with variables(`$URL`, `$DOMAIN`).
(Default: `http://favicon.hatena.ne.jp/?url=$URL`)

### useHatena
You can use Hatena Blog Card if you set `true`.
(Default: `false`)

### Example

_config.yml:

```yaml
blogCard:
  className: sample
  descriptionLength: 6
  faviconAPI: http://www.google.com/s2/favicons?domain=$DOMAIN
```

or

```yaml
blogCard:
  className: sample
  useHatena: true
```


## Style

You can customize the style.

Example:

[View in CodePen](https://codepen.io/hinastory/pen/povWEGj)

## Thanks
This plugin refers to the following OSS resources:

- https://github.com/minamo173/hexo-tag-link-preview
- https://github.com/Gisonrg/hexo-github-card
- https://github.com/shundroid/hexo-embed-hatena-blog-card

Thanks to them.

## License

MIT

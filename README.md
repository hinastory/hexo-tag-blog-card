# hexo-tag-blog-card
Embed a blog card on your [Hexo](https://hexo.io/) article.

[![hexo](https://img.shields.io/badge/Hexo-%3E%3D3.0-blue.svg?style=flat-square)](https://hexo.io)

## Installation

`npm install hexo-tag-blog-card`

## Usage
`{% blogCard url [target] [rel] %}`

Example:
```
{% blogCard https://www.amazon.com/ _blank nofollow %}
```

### Explantion of attributes

1. url - An URL for the link. Required.
1. target attribute - if you need to open link with another window, you must set here "_blank".
1. rel attribute - if you need to link with rel="nofollow", set here "nofollow".

Target attribute and rel attribute can be abbreviated. But if only target attribute abbreviated, will not work correctly.

If you need to open same window and set rel="nofollow", please write down like below.

### See also

## Options
### className
You can provide top-level class name of this preview link HTML.
(Default: `blog-card`)

### descriptionLength
You can provide number of character in og-description.
(Default: `140`)

### Example

_config.yml:

```yaml
blogCard:
  className: sample
  descriptionLength: 6
```

## Thanks
This plugin refers to the following three OSS resources:

- https://github.com/minamo173/hexo-tag-link-preview
- https://github.com/hinastory/hexo-oembed

Thanks to them.

## License

MIT

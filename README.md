# gatsby-remark-embedded-gist

[![NPM badge](https://img.shields.io/npm/v/gatsby-remark-embedded-gist.svg?style=flat-square)](https://www.npmjs.com/package/gatsby-remark-embedded-gist)
[![Travis badge](https://img.shields.io/travis/weirdpattern/gatsby-remark-embedded-gist.svg?branch=master&style=flat-square)](https://travis-ci.org/weirdpattern/gatsby-remark-embedded-gist)

This plugin allows content authors to embed [Gist](https://gist.github.com/) 
snippets.

## Getting started

To embed a Gist snippet in you markdown/remark content, simply add an inline code 
block using the `gist:` protocol.

```md
`gist:[<username>/]<gist_id>[#<gist_file>]`
```

Where:  
- **username**, represents the github handler whose gist is to be accessed.  
Can be defaulted via configuration.
- **gist_id**, is the id of the gist to be accessed.   
This is the hash value in the gist url, e.g. https://gist.github.com/<username>/`ce54fdb1e5621b5966e146026995b974`).
- **gist_file**, is the name of the file in the gist to be accessed.

## Installation

`yarn add gatsby-remark-embedded-gist`

## Usage

```javascript
// In your gatsby-config.js
{
  resolve: "gatsby-transformer-remark",
  options: {
    plugins: [
      {
        resolve: "gatsby-remark-embedded-gist",
        options: {
          // Optional:

          // the github handler whose gists are to be accessed
          username: 'weirdpattern',

          // a flag indicating whether the github default gist css should be included or not
          // default: true
          includeDefaultCss: true
        }
      }
    ]
  }
}
```

## Example

Turns this...  
```md
`gist:weirdpattern/ce54fdb1e5621b5966e146026995b974#syntax.text`
```

Into this...  
```html
<div id="gist90436059" class="gist">
    <div class="gist-file">
      <div class="gist-data">
        <div class="js-gist-file-update-container js-task-list-container file-box">
          <div id="file-syntax-text" class="file">
            <div itemprop="text" class="blob-wrapper data type-text">
              <table class="highlight tab-size js-file-line-container" data-tab-size="8">
                <tbody>
                  <tr>
                    <td id="file-syntax-text-L1" class="blob-num js-line-number" data-line-number="1"></td>
                    <td id="file-syntax-text-LC1" class="blob-code blob-code-inner js-file-line">&lt;operation&gt; [n]&gt; /dev/null [options]</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="gist-meta">
        <a href="https://gist.github.com/weirdpattern/ce54fdb1e5621b5966e146026995b974/raw/30a0ad953a8d79c8bcbdd76343d86a9e4bbda311/syntax.text" style="float:right">view raw</a>
        <a href="https://gist.github.com/weirdpattern/ce54fdb1e5621b5966e146026995b974#file-syntax-text">syntax.text</a>
        hosted with ❤ by <a href="https://github.com">GitHub</a>
      </div>
    </div>
</div>
```
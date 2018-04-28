# generator-important-misc 

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Build Status](https://travis-ci.org/nickccm1122/generator-important-misc.svg?branch=master)](https://travis-ci.org/nickccm1122/generator-important-misc)

> Create linter/formatter/githook into your project

## Installation

First, install [Yeoman](http://yeoman.io) and generator-important-misc using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-important-misc
```

Then generate your linter/formatter/githooks:

```bash
cd <your-project-root>
yo important-misc
```

## What is included

- [editorconfig][editorconfig-link]
- [ignore-sync](ignore-sync-link) CLI tool to build and sync .*ignore files across files and repositories
- [markdownlint](markdownlint-link) Markdown lint tool
- [commitlint](commitlint-link) Lint commit messages
- [import-sort](import-sort-link)
- [lint-staged](lint-staged-link)

### Default created/updated files

```bash
├── .commitlintrc.json
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .gitignore-sync
├── .markdownlint.json
├── package.json
└── yarn.lock
```

package.json

```diff json
{
  "devDependencies": {
+    "ignore-sync": "^1.2.0",
+    "markdownlint-cli": "^0.8.1",
+    "@commitlint/cli": "^6.1.3",
+    "@commitlint/config-conventional": "^6.1.3",
+    "import-sort-cli": "^4.2.0",
+    "import-sort-parser-babylon": "^4.2.0",
+    "import-sort-style-module": "^4.2.0",
+    "husky": "^0.14.3",
+    "lint-staged": "^7.0.0"
  },
  "scripts": {
+    "ignore-sync": "ignore-sync",
+    "commitmsg": "commitlint -e $GIT_PARAMS",
+    "lint-staged": "lint-staged",
+    "precommit": "lint-staged"
  },
+  "importSort": {
+    ".js": {
+      "parser": "import-sort-parser-babylon",
+      "style": "import-sort-style-module"
+    }
+  },
+  "lint-staged": {
+    "*.js": [
+      "import-sort --write",
+      "git add"
+    ],
+    "*ignore-sync": [
+      "ignore-sync",
+      "git add"
+    ],
+    "*.md": [
+      "markdownlint",
+      "git add"
+    ]
+  }
}
```


## License

MIT © [Nick Chan](https://mingisaniceguy.com)

[npm-image]: https://badge.fury.io/js/generator-important-misc.svg
[npm-url]: https://npmjs.org/package/generator-important-misc
[travis-image]: https://travis-ci.org/nickccm1122/generator-important-misc.svg?branch=master
[travis-url]: https://travis-ci.org/nickccm1122/generator-important-misc
[daviddm-image]: https://david-dm.org/nickccm1122/generator-important-misc.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/nickccm1122/generator-important-misc

[editorconfig-link]: http://editorconfig.org/
[ignore-sync-link]: https://github.com/foray1010/ignore-sync
[markdownlint-link]: https://github.com/markdownlint/markdownlint
[commitlint-link]: https://github.com/marionebl/commitlint
[import-sort-link]: https://github.com/renke/import-sort
[lint-staged-link]: https://github.com/okonet/lint-staged
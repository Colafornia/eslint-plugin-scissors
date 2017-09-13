# eslint-plugin-scissors
[![version](https://img.shields.io/npm/v/eslint-plugin-scissors.svg)](https://www.npmjs.com/package/eslint-plugin-scissors)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-scissors.svg)](https://npmjs.com/package/eslint-plugin-scissors) [![Build Status](https://api.travis-ci.org/MechanicianW/eslint-plugin-scissors.svg)](https://travis-ci.org/MechanicianW/eslint-plugin-scissors)

👮🏻 detect long call chains/nested expressions ✂️

🙋 say goodbye to 'NullReferenceException' 💣

# Introduction
The rule named 'nested-expressions' will lint the code in `then/catch` method, throw warning when detect nested expressions that would case NPE error.

🚫 Examples of incorrect code for this rule:
```javascript
API.getList()
    .then(function (res) {
        this.result.add = res.data.add; // res.data could be null
     });

API.getList()
    .then((res) => {
        if (res.status === 0) {
            this.result = res.status && res.data.length ? res.data : []; // res.data could be null
        }
})
```

✅ Examples of correct code that have made fault-tolerant:
```javascript
API.getList()
    .then(function (res) {
        this.result.add = res.data ? res.data.add : {};
    });


API.getList()
    .then(function (res) {
        if (res.data) {
            this.result.add = res.data.add;
        }
     });

API.getList()
    .then(function (res) {
        try {
            this.result.add = res.data.add;
        } catch (e) {
            // blabla
        }
     });

API.getList()
    .then(function (res) {
        if (res && res.status && res.data && res.data.page) {
            this.result.list = res.data.page.list;
        }
     });
```

# Quickstart
## Installation

Install [ESLint](https://www.github.com/eslint/eslint) and this plugin either locally or globally.

```sh
$ npm install eslint --save-dev
$ npm install eslint-plugin-scissors --save-dev
```

## Configuration
Then add a reference to this plugin and selected rules in your eslint config:

```javascript
{
  "plugins": [
    "scissors"
  ],
  "rules": {
    // default setting we recommended
    "scissors/nested-expressions": 1
  }
}
```

If you make sure that some variables using is **absolutely safe**(of course, there is no absolutely safe in development🙂), you can add these to white list to skip the plugin check:

```javascript
  "rules": {
    // if you use Angular.js, maybe skipping '$scope' is useful
    "scissors/nested-expressions": [1, { "skip": ['$scope', 'window'] }]
  }
```

**Note the situation that use of the response value to rewrite the variable, it would cause NPE too.**

**Tips**: If you want to lint the '.vue' file, you need to import [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue):

```json
  "plugins": [
    "vue",
    "scissors"
  ]
```

See [Configuring Eslint](http://eslint.org/docs/user-guide/configuring) on [eslint.org](http://eslint.org) for more info.

## Recomended Usage
The first run, you're likely to receive a lot of warnings.
dealing with all risks at once is hard, so suggest that you run eslint only on changes files using [pre-commit](https://github.com/observing/pre-commit) and [lint-staged](https://github.com/okonet/lint-staged):

```json
"scripts": {
  "check-commit": "eslint",
  "lint-staged": "lint-staged"
},
"lint-staged": {
  "*.js": ["check-commit"],
  "*.vue": ["check-commit"]
},
"pre-commit": [
  "lint-staged"
]
```

If you use [eslint-loader](https://github.com/MoOx/eslint-loader) in webpack, suggest that you set **quiet** option:

```javascript
module.exports = {
  entry: "...",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          quiet: true,
        }
      },
    ],
  },
}
```

## Contributing

Any issue and PR is super welcome!

1. Fork it!
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -am 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request :D

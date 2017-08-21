# eslint-plugin-scissors
[![version](https://img.shields.io/npm/v/eslint-plugin-scissors.svg)](https://www.npmjs.com/package/eslint-plugin-scissors)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-scissors.svg)](https://npmjs.com/package/eslint-plugin-scissors) [![Build Status](https://api.travis-ci.org/MechanicianW/eslint-plugin-scissors.svg)](https://travis-ci.org/MechanicianW/eslint-plugin-scissors)

👮🏻 detects long call chains/nested expressions ✂️

🙋 say goodbye to 'NullReferenceException' 💣

# Quickstart
## Installation

Install [ESLint](https://www.github.com/eslint/eslint) and this plugin either locally or globally.

```sh
$ npm install eslint --save-dev
$ npm install eslint-plugin-scissors --save-dev
```

## Configuration
Then add a reference to this plugin and selected rules in your eslint config:
```json
{
  "plugins": [
    "scissors"
  ],
  "rules": {
    "scissors/nested-expressions": 1
  }
}
```
See [Configuring Eslint](http://eslint.org/docs/user-guide/configuring) on [eslint.org](http://eslint.org) for more info.


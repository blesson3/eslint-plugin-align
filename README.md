# eslint-plugin-align

ESLint plugin to support vertical alignment rules.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-align`:

```
$ npm install eslint-plugin-align --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you
must also install `eslint-plugin-align` globally.

## Usage

Add `align` to the plugins section of your `.eslintrc` configuration file.
You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "align"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "align/es6-import-vertical-alignment": 2
    }
}
```

## Supported Rules

### ES6 Import Vertical Alignment

[Docs](./docs/rules/es6-import-vertical-alignment.md)

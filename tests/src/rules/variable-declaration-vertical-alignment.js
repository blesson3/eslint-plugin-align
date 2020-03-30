/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @fileoverview Tests the variable declaration alignment rule
 * @author Matt Blessed
 */


// TODO: write the tests

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { RuleTester }    = require('eslint');
const path              = require('path');
const { default: rule } = require('../../../lib/rules/variable-declaration-vertical-alignment');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserPath = path.join(__dirname, '..', '..', '..', 'node_modules/@typescript-eslint/parser');

RuleTester.setDefaultConfig({
  parser       : parserPath,
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const ruleTester = new RuleTester();
ruleTester.run('variable-declaration-vertical-alignment', rule, {

  valid: [
    // give me some code that won't trigger a warning
    {
      code: `
const { RuleTester }    = require('eslint');
const path              = require('path');
const { default: rule } = require('../../../lib/rules/es6-import-vertical-alignment');`,
    },
    `
let foo   = 'bar';
let lorem = 'bar2';`,
  ],

  invalid: [
    {
      code: `
const { RuleTester } = require('eslint');
const path = require('path');
const { default: rule } = require('../../../lib/rules/es6-import-vertical-alignment');`,
      errors: [
        {
          message: "Missing space(s) to align 'const { RuleTester } = require('eslint');'",
          type   : 'VariableDeclaration',
        },
        {
          message: "Missing space(s) to align 'const path = require('path');'",
          type   : 'VariableDeclaration',
        },
      ],
    },

    {
      code: `
let foo = 'bar';
let lorem = 'bar2';`,
      errors: [
        {
          message: "Missing space(s) to align 'let foo = 'bar';'",
          type   : 'VariableDeclaration',
        },
      ],
    },
  ],
});

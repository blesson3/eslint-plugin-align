/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @fileoverview Tests the assignment alignment rule
 * @author Matt Blessed
 */


// TODO: write the tests

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { RuleTester }    = require('eslint');
const path              = require('path');
const { default: rule } = require('../../../lib/rules/assignment-vertical-alignment');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserPath = path.join(__dirname, '..', '..', '..', 'node_modules/@typescript-eslint/parser');

RuleTester.setDefaultConfig({
  parser       : parserPath,
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const ruleTester = new RuleTester();
ruleTester.run('assignment-vertical-alignment', rule, {

  valid: [
    // give me some code that won't trigger a warning
    {
      code: `
let foo = 'bar';
let lorem = 'bar2';

foo   = null;
lorem = null;`,
    },
  ],

  invalid: [
    {
      code: `
let foo = 'bar';
let lorem = 'bar2';
      
foo = null;
lorem = null;`,
      errors: [
        {
          message: "Missing space(s) to align 'foo = null;'",
          type   : 'AssignmentExpression',
        },
      ],
    },
  ],
});

/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @fileoverview Tests the ES6 import vertical alignment rule
 * @author Matt Blessed
 */


// TODO: write the tests

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { RuleTester } = require('eslint');
const path = require('path');
const { default: rule } = require('../../../lib/rules/es6-import-vertical-alignment');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserPath = path.join(__dirname, '..', '..', '..', 'node_modules/@typescript-eslint/parser');

RuleTester.setDefaultConfig({
  parser       : parserPath,
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const ruleTester = new RuleTester();
ruleTester.run('es6-import-vertical-alignment', rule, {

  valid: [
    // give me some code that won't trigger a warning
    {
      code: `
import { RuleTester } from 'eslint';
import rule           from '../../../src/rules/es6-import-vertical-alignment';`,
    },
  ],

  invalid: [
    {
      code: `
import { RuleTester } from 'eslint';
import rule from '../../../src/rules/es6-import-vertical-alignment';`,
      errors: [{
        message: "Missing space(s) to align 'import rule from '../../../src/rules/es6-import-vertical-alignment';'",
        type   : 'ImportDeclaration',
      }],
    },
  ],
});

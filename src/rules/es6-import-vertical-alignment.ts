/**
 * @fileoverview Rule to enforce ES6 import vertical alignment
 * @author Matt Blessed
 */

import VerifyAlignment from '../helpers/verify-alignment';

const REGEX_ES6_IMPORT_LINE = /^(import\s+.*?)(from.*$)/;

// Helpers

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default {
  meta: {
    type    : 'layout',
    fixable : 'whitespace',
    messages: {
      missingWhitespace: "Missing space(s) to align '{{ line }}'",
    },
  },
  create(context: any): any {
    const sourceCode = context.getSourceCode();

    return {
      ImportDeclaration: (node: any): any => {
        VerifyAlignment({ sourceCode, context },
          { node, lineMatch: REGEX_ES6_IMPORT_LINE });
      },
    };
  },
};

/**
 * @fileoverview Rule to enforce variable declaration vertical alignment
 * @author Matt Blessed
 */

import VerifyAlignment from '../helpers/verify-alignment';

const REGEX_VARIABLE_DECLARATION = /^((?:const|let|var).*?)\s(=\s+.*)$/;


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
      VariableDeclaration: (node: any): any => {
        VerifyAlignment({ sourceCode, context },
          { node, lineMatch: REGEX_VARIABLE_DECLARATION });
      },
    };
  },
};

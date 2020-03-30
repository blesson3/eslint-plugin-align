/**
 * @fileoverview Rule to enforce assignment vertical alignment
 * @author Matt Blessed
 */

import VerifyAlignment from '../helpers/verify-alignment';

const REGEX_ASSIGNMENT = /^((?!let|const|var).*?)\s+(=\s+.*)$/;


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
      AssignmentExpression: (node: any): any => {
        VerifyAlignment({ sourceCode, context },
          { node, lineMatch: REGEX_ASSIGNMENT });
      },
    };
  },
};

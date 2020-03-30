/**
 * @fileoverview ESLint plugin for general alignment
 * @author Matt Blessed
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-var-requires
const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const rules = requireIndex(`${__dirname}/rules`);

// import all rules in lib/rules
module.exports.rules = rules;

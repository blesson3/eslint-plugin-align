/**
 * @fileoverview Does a test thing
 * @author Matt Blessed
 */
"use strict";

// TODO: write the tests

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/test-me"),
    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("import-vertical-alignment", rule, {

    valid: [
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "<failing code>",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});

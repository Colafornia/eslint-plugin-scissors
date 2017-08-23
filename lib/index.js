/**
 * @fileoverview detects long call chains/nested expressions
 * @author wangyilin06
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var nestedExpressions = require('./rules/nested-expressions');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = {
    'nested-expressions': nestedExpressions
}

module.exports.configs = {
    recommended: {
        rules: {
            'scissors/nested-expressions': 1
        }
    }
}




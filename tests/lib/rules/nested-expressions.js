var rule = require('../../../lib/rules/nested-expressions');
var RuleTester = require('eslint').RuleTester;
var ruleTester = new RuleTester();

ruleTester.run('nested-expressions', rule, {
    valid: [
        `this.getListQuotas({type: 1})
            .then(function (events) {
                var subEvent = a.b;
        })`
    ],
    invalid: [
        {

            code: `this.getListQuotas({type: 1})
                .then(function (events) {
                    var subEvent = a.b.c;
            })`,
            errors: [{
                message: "would cause NPE error",
                type: 'ExpressionStatement'
            }]
        }
    ]
});
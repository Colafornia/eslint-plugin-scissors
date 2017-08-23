var rule = require('../../../lib/rules/nested-expressions');
var RuleTester = require('eslint').RuleTester;
var ruleTester = new RuleTester();

ruleTester.run('nested-expressions', rule, {
    valid: [
        `this.getList({type: 1})
            .then(function (events) {
                var subEvent = a.b;
        })`,
        `this.getList({type: 1})
            .then(function (events) {
                var subEvent = a.b ? a.b.c : {}
        })`,
        `API.getApi()
        .then(function (res) {
            if (res && res.data) {
                this.privilege.add = res.data.add;
                this.privilege.download = res.data.download;
                this.privilege.search = res.data.select;
            }
        });`
    ],
    invalid: [
        {
            code: `this.getList({type: 1})
                .then(function (events) {
                    var subEvent = a.b.c;
            })`,
            errors: [{
                message: "a.b could be null, would cause NullReferenceException error"
            }]
        },{
            code:`API.getApiV1()
                .then(function (res) {
                        this.privilege.add = res.data.add;
                        this.privilege.download = res.data.download;
                        this.privilege.search = res.data.select;
                });`,
            errors: [{
                message: "res.data could be null, would cause NullReferenceException error"
            },{
                message: "res.data could be null, would cause NullReferenceException error"
            },{
                message: "res.data could be null, would cause NullReferenceException error"
            }]
        }
    ]
});
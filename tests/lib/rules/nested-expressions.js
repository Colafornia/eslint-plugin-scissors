var rule = require('../../../lib/rules/nested-expressions');
var RuleTester = require('eslint').RuleTester;
var ruleTester = new RuleTester();

ruleTester.run('nested-expressions', rule, {
    valid: [
        `this.getList({type: 1})
            .then(function (events) {
                var subEvent = a.b;
        })`,
        `api.prvseaFocus(query).$promise.then(function (events) {
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
        });`,
        `API.getApi()
        .then(function (res) {
            try {
                this.privilege.add = res.data.add;
                this.privilege.download = res.data.download;
                this.privilege.search = res.data.select;
            } catch (e) {
                // blabla
            }
        });`,
        `API.getApi()
        .then(function (res) {
            if (res.data) {
                this.privilege.add = res.data.add;
                this.privilege.download = res.data.download;
                this.privilege.search = res.data.select;
            }
        });`,
        `this.getApi()
            .then(function (res) {
                if (res.status === 0) {
                    this.list = res.data && res.data.length ? res.data : [];
                }
            })`,
        `this.getApi()
            .then(function (res) {
                if (res.status === 0) {
                    this.list = res.data && res.status && res.data.length ? res.data : [];
                }
            })`,
            `this.getApi()
                .then(function (res) {
                    if (res && res.status && res.data && res.data.page) {
                        this.page = res.data.page;
                        this.list = res.data.page.list;
                    }
            });`,
            `this.getApi()
                .then(function (res) {
                    if (!res.data || !res.data.info) {
                        this.list = [];
                    }
            })`,
            `if (this.info && this.info.id) {
                    this.getApi(this.info.id).then(function (res) {
                        this.id = res;
                    });
            }`,
            `this.getApi()
                .then(function (res) {
                    if (res && res.status === 0 && res.data && res.data.page) {
                        this.list = res.data.dataList || [];
                        this.page.count = res.data.page.totalCount;
                        this.page.no = res.data.page.pageNo;
                    }
                })`,
                ` this.getApi()
                    .then(function (objects) {
                        var object = this.target ? this.target.object : {};
                        if (!object) {
                            this.target.object = this.objects && this.objects[0] ? this.objects[0] : {};
                        }
                    })`
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
            code: `API.getApiV1()
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
        },{
            code: `this.getApi()
                .then(function (res) {
                    if (res.status === 0) {
                        this.rules = res.others && res.status && res.data.length ? res.data : [];
                    }
                })`,
                errors: [{
                    message: "res.data could be null, would cause NullReferenceException error"
                }]
        },{
            code: `this.getApi()
                .then(function (res) {
                    if (res.status === 0) {
                        this.rules.push(res.data.page)
                    }
                })`,
                errors: [{
                    message: "res.data could be null, would cause NullReferenceException error"
                }]
        }
    ]
});
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
                    })`,
                    `this.getApi()
                        .then(function (res) {
                            if (res && res.status === 0) {
                                if (res.data && res.data.list && res.data.list.length) {
                                    this.result = res.data.list[0]
                                }
                            }
                        })`,
                        `this.getApi()
                            .then(function (data) {
                                for (var i = 0, len = data.length; i < len; i++) {
                                    if (data[i] && data[i].id === regionId) {
                                        result = data[i].members;
                                        break;
                                    }
                                }
                            })`,
                        `this.getApi()
                            .then(function (data) {
                            if (res && res.data && res.data.code === 200) {
                                        this.create({
                                            className: 'success',
                                            content: res.data.message
                                        });
                                    }
                            })`,
                        `this.getApi()
                            .then(function (data) {
                                if (data.city) {
                                    if (someOtherCheck()) {
                                        this.city = data.city.id;
                                    }
                                }
                            })`,
                        `this.getApi()
                            .then(function (res) {
                                if (res.data && res.data.code === 200 && $scope.list) {
                                    for (var i = 0; i < $scope.list.length; i++) {
                                        this.result = $scope.list[0];
                                    }
                                }
                            })`,
                        `this.getApi()
                            .then(function (res) {
                                if (res && res.data && res.status === 0) {
                                    $scope.list = res.data.dataList || [];
                                    $scope.options.totalItems = res.data.total;
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
        },{
            code: `this.getApi()
                .then(function (data) {
                    if (data.status && data.status.code === 0) {
                        this.result = data.data || {};
                    } else {
                        alert(data.data || data.status.value || 'error');
                    }
                });`,
            errors: [{
                message: "data.status could be null, would cause NullReferenceException error"
            }]
        }
    ]
});
var ruleUtil = require('../utils/nested-expressions-utils');
module.exports = {
    meta: {
        docs: {
            description: "warning when use long nested expressions in case of NPE",
            category: "Possible Errors",
            recommended: true
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    skip: {
                        type: "array"
                    }
                },
                additionalProperties: false
            }
        ]
    },
    create: function (context) {
        var checkMethodNameList = ['then', 'catch'];
        var options = context.options[0] || {};
        var whiteList = typeof options.skip !== "undefined" ? options.skip : [];
        var throwWarning = function (node, message) {
            context.report({node: node, message: message || 'would cause NullReferenceException error'});
        }
        return {
            MemberExpression (node) {
                // may be chained expression and ensure it's not method call
                if (node && node.object && node.object.object) {
                    if (node.parent.type === 'CallExpression' && !ruleUtil.isArgumentsHit(node)) {
                        return;
                    }
                    if (node.parent.type !== 'AssignmentExpression' || node.parent.left !== node ) {
                        var parent = node.parent;
                        while (!parent.expression || !parent.expression.callee || !parent.expression.callee.property
                            || !parent.expression.callee.property.name || checkMethodNameList.indexOf(parent.expression.callee.property.name) === -1) {
                                if (parent.type !== 'TryStatement') {
                                    parent = parent.parent;
                                } else {
                                    parent = null;
                                }
                                if (!parent) break;
                        }
                        if (parent && parent !== node.parent) {
                            // hit method we want to check
                            // then do some work to avoid friendly fire
                            if (whiteList.includes(node.object.object.name)) {
                                return;
                            }
                            if (!ruleUtil.isHaveChecked(parent, node)) {
                                if (!ruleUtil.isLogicalRightExpression(parent, node)) {
                                    throwWarning(node.object.object, ruleUtil.packageWarningMsg(node.object));
                                }
                            }
                        }
                    }
                }
            }
        };
    }
};
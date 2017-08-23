var ruleUtil = require('../utils/nested-expressions-utils');
module.exports = {
    meta: {
        docs: {
            description: "warning when use long nested expressions in case of NPE",
            category: "Possible Errors",
            recommended: true
        },
        fixable: "code",
        schema: [] // no options
    },
    create: function (context) {
        var checkMethodNameList = ['then', 'catch'];
        var throwWarning = function (node, message) {
            context.report({node: node, message: message || 'would cause NullReferenceException error'});
        }
        return {
            MemberExpression (node) {
                if (node && node.object && node.object.object) {
                    if (node.parent.type !== 'AssignmentExpression' || node.parent.left !== node) {
                        var parent = node.parent;
                        while (!parent.expression || !parent.expression.callee || !parent.expression.callee.property
                            || !parent.expression.callee.property.name) {
                                parent = parent.parent;
                                if (!parent) break;
                        }
                        if (parent && parent !== node.parent) {
                            if (checkMethodNameList.indexOf(parent.expression.callee.property.name) !== -1) {
                                // hit method we want to check
                                // then do some work to avoid friendly fire
                                if (!ruleUtil.isHaveChecked(parent, node)) {
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
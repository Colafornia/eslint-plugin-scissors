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
        var throwWarning = function (node, message) {
            context.report({node: node, message: message || 'would cause NullReferenceException error'});
        }
        return {
            ExpressionStatement(node) {
                if (node.expression && node.expression.callee && node.expression.callee.property && node.expression.callee.property.name) {
                    var propertyName = 'then';
                    if (propertyName === 'then' && node.expression.arguments && node.expression.arguments.length) {
                        var argument = node.expression.arguments[0];
                        if (argument.body && argument.body.body && argument.body.body.length) {
                            var states = argument.body.body;
                            states.forEach((state) => {
                                if (state.type === 'VariableDeclaration' && state.declarations && state.declarations.length) {
                                    state.declarations.forEach((declaration) => {
                                        // exist chain expression such as a.b.c
                                        if (declaration.init && declaration.init.object && declaration.init.object.object) {
                                            var nodeName = '';
                                            if (declaration.init.object.object.name && declaration.init.object.property.name) {
                                                nodeName = declaration.init.object.object.name + '.' + declaration.init.object.property.name
                                                    + ' could be null, would cause NullReferenceException error'
                                            }
                                            throwWarning(declaration.init.object.object, nodeName);
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            }
        };
    }
};
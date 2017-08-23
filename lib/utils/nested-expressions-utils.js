module.exports = {
    packageWarningMsg: packageWarningMsg,
    isHaveChecked: isHaveChecked,
    inTripletExpressionHaveChecked: inTripletExpressionHaveChecked,
    inIfStatementHaveChecked: inIfStatementHaveChecked
}
function packageWarningMsg (object) {
    var msg = ''
    if (object.object.name && object.property.name) {
        msg = object.object.name + '.' + object.property.name
            + ' could be null, would cause NullReferenceException error'
    }
    return msg
}
function isHaveChecked (parent, node) {
    return inTripletExpressionHaveChecked(parent, node) || inIfStatementHaveChecked(parent, node)
}
function inTripletExpressionHaveChecked (parent, node) {
    var result = false;
    if (node.parent.type === 'ConditionalExpression') {
        var test = node.parent.test;
        if (test && test.object && test.object && test.property && test.object.name && test.property.name) {
            var testObjectName = `${test.object.name}.${test.property.name}`;
            var hitLintObjectName = `${node.object.object.name}.${node.object.property.name}`;
            result = testObjectName === hitLintObjectName;
        }
    }
    return result;
}
function inIfStatementHaveChecked (rootparent, node) {
    // return node.parent.type === 'LogicalExpression'
    var result = false;
    var parent = node.parent;
    while (parent.type !== 'BlockStatement') {
        parent = parent.parent;
        if (!parent) break;
    }
    if (parent && parent.parent && parent.parent.type === 'IfStatement' && parent.parent.test) {
        var testObjectName = '';
        var hitLintObjectName = `${node.object.object.name}.${node.object.property.name}`;
        if (parent.parent.test.left && parent.parent.test.right) {
            var right = parent.parent.test.right
            if (right.object && right.property) {
                testObjectName = `${right.object.name}.${right.property.name}`;
            }
        } else if (parent.parent.test.object) {
            testObjectName = `${parent.parent.test.object.name}.${parent.parent.test.property.name}`;
        }
        result = testObjectName === hitLintObjectName;
    }
    return result;
}

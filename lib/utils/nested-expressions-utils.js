module.exports = {
    packageWarningMsg: packageWarningMsg,
    isHaveChecked: isHaveChecked,
    inTripletExpressionHaveChecked: inTripletExpressionHaveChecked,
    inIfStatementHaveChecked: inIfStatementHaveChecked,
    isLogicalRightExpression: isLogicalRightExpression,
    isLeftExpressionHaveChecked: isLeftExpressionHaveChecked
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
function inTripletExpressionHaveChecked (rootparent, node) {
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
    var result = false;
    var parent = node.parent;
    while (parent.type !== 'BlockStatement') {
        parent = parent.parent;
        if (!parent) break;
    }
    if (parent && parent.parent && parent.parent.type === 'IfStatement' && parent.parent.test) {
        var testObjectName = '';
        var hitLintObjectName = `${node.object.object.name}.${node.object.property.name}`;
        var testNode = parent.parent.test;
        if (testNode.left && testNode.right) {
            var right = testNode.right
            if (right.object && right.property) {
                testObjectName = `${right.object.name}.${right.property.name}`;
            }
        } else if (testNode.object) {
            testObjectName = `${testNode.object.name}.${testNode.property.name}`;
        }
        result = testObjectName === hitLintObjectName;
    }
    return result;
}

function isLeftExpressionHaveChecked (rootparent, node) {
    var result = false;
    var hitLintObjectName = `${node.object.object.name}.${node.object.property.name}`;
    var testObjectName = '';
    if (node.parent.left) {
        var leftNode = node.parent.left;
        if (!leftNode.left && leftNode.object && leftNode.property) {
            testObjectName = `${leftNode.object.name}.${leftNode.property.name}`;
            result = testObjectName === hitLintObjectName;
        } else {
            var tempLeft = leftNode.left;
            var tempRight = node.parent.right;
            while (tempLeft.left) {
                tempLeft = tempLeft.left;
                if (tempLeft) {
                    tempRight = tempLeft.parent.right;
                    if (tempRight.object && tempRight.property) {
                        testObjectName = `${tempRight.object.name}.${tempRight.property.name}`;
                        if (testObjectName === hitLintObjectName) {
                            result = true;
                            break;
                        }
                    }
                }
            }
            if (!result && tempLeft && tempLeft.object && tempLeft.property) {
                testObjectName = `${tempLeft.object.name}.${tempLeft.property.name}`;
                result = testObjectName === hitLintObjectName;
            }
        }
    }
    return result;
}

function isLogicalRightExpression (parent, node) {
    return node.parent.type === 'LogicalExpression' && node.parent.right === node;
}

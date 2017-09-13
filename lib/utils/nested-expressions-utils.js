module.exports = {
    packageWarningMsg: packageWarningMsg,
    isHaveChecked: isHaveChecked,
    inTripletExpressionHaveChecked: inTripletExpressionHaveChecked,
    inIfStatementHaveChecked: inIfStatementHaveChecked,
    isLogicalRightExpression: isLogicalRightExpression,
    isLeftExpressionHaveChecked: isLeftExpressionHaveChecked,
    isArgumentsHit: isArgumentsHit
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
        || inUnaryOrBinaryExpressionHaveChecked(parent, node);
}

function inUnaryOrBinaryExpressionHaveChecked (parent, node) {
    var result = false;
    var types = ['UnaryExpression', 'BinaryExpression'];
    if (types.includes(node.parent.type) && node.parent.parent.right === node.parent) {
        var hitLintObjectName = getObjectNameDeeply(node);
        result = isLeftExpressionHaveChecked(parent, node.parent, hitLintObjectName);
    }
    return result;
}

function inTripletExpressionHaveChecked (rootparent, node) {
    var result = false;
    if (node.parent.type === 'ConditionalExpression') {
        var test = node.parent.test;
        if (test && test.object && test.property) {
            var testObjectName = getObjectNameDeeply({object: test});
            var hitLintObjectName = getObjectNameDeeply(node);
            result = testObjectName === hitLintObjectName;
        } else if (test && test.left && test.right) {
            return isLeftExpressionHaveChecked(rootparent, test.right);
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
    if (parent && parent.parent && parent.parent.type === 'IfStatement' && parent.parent.test && parent.parent.alternate
 !== parent) {
        var testObjectName = '';
        var hitLintObjectName = getObjectNameDeeply(node);
        var testNode = parent.parent.test;
        if (testNode.left && testNode.right) {
            var right = testNode.right
            if (right.object && right.property) {
                testObjectName = getObjectNameDeeply(right);
                if (testObjectName !== hitLintObjectName && testNode.left.left) {
                    return isLeftExpressionHaveChecked(rootparent, testNode.right, hitLintObjectName)
                }
            } else {
                testObjectName = getObjectNameDeeply(testNode.left);
            }
        } else if (testNode.object) {
            testObjectName = `${testNode.object.name}.${testNode.property.name}`;
        }
        result = testObjectName === hitLintObjectName;
    }
    return result;
}


function isLeftExpressionHaveChecked (rootparent, node, hitName) {
    var result = false;
    var hitLintObjectName = hitName ? hitName : getObjectNameDeeply(node);
    var testObjectName = '';
    if (node.parent && node.parent.left) {
        var leftNode = node.parent.left;
        if (!leftNode.left && leftNode.object && leftNode.property) {
            testObjectName = getObjectNameDeeply({object: leftNode});
            result = testObjectName === hitLintObjectName;
        } else if (!leftNode.left && leftNode.argument && leftNode.argument.object && leftNode.argument.property) {
            testObjectName = getObjectNameDeeply({object: leftNode.argument});
            result = testObjectName === hitLintObjectName;
        } else {
            if (leftNode.right && leftNode.right.type === 'MemberExpression' && leftNode.right.object
                && leftNode.right.property) {
                    testObjectName = getObjectNameDeeply({object: leftNode.right});
                    if (testObjectName === hitLintObjectName) {
                        result = true;
                        return result;
                    }
            }
            var tempLeft = leftNode.left;
            while (tempLeft && tempLeft.left) {
                tempLeft = tempLeft.left;
                if (tempLeft) {
                    tempRight = tempLeft.parent.right;
                    if (tempRight.object && tempRight.property) {
                        testObjectName = getObjectNameDeeply({object: tempRight});
                        if (testObjectName === hitLintObjectName) {
                            result = true;
                            break;
                        }
                    }
                } else {
                    tempLeft = tempLeft.parent;
                    break;
                }
            }
            if (!result && tempLeft && tempLeft.object && tempLeft.property) {
                testObjectName = getObjectNameDeeply({object: tempLeft});
                result = testObjectName === hitLintObjectName;
            }
        }
    }
    return result;
}

// TODO: use traverseTree to make code clean
// function traverseLogicalTree (node) {
//     if (node.left) {
//         traverseLogicalTree(node.left);
//         traverseLogicalTree(node.right);
//     } else {
//         console.log (node)
//     }
// }

function isLogicalRightExpression (parent, node) {
    if (node.parent.type === 'LogicalExpression' && node.parent.right === node) {
        return isLeftExpressionHaveChecked(parent, node);
    } else {
        let checkNode = node.parent.parent;
        while (checkNode.type !== 'LogicalExpression') {
            checkNode = checkNode.parent;
            if (!checkNode.parent) {
                checkNode = null;
                break;
            }
        }
        if (checkNode && checkNode.right) {
            return isLeftExpressionHaveChecked(parent, checkNode.right);
        }
        return false;
    }
}

function isArgumentsHit (node) {
    var result = false;
    if (node.parent && node.parent.arguments && node.parent.arguments[0] && node.parent.arguments[0] === node) {
        result = true;
    }
    return result;
}

function getObjectNameDeeply (node) {
    var name = '';
    if (node.object && node.object.name && node.property && node.property.name) {
        name = `${node.object.name}.${node.property.name}`
    } else {
        var target = node.object;
        if (target && target.object && target.property && target.object.name && target.property.name) {
            name = `${target.object.name}.${target.property.name}`;
        } else if (target && target.object && !target.object.name && target.object.type === 'ThisExpression') {
            name = `this.${target.property.name}`;
        } else if (target && target.object && !target.object.name && target.object.object && target.object.property) {
            name = `${target.object.object.name}.${target.object.property.name}`;
        }
    }
    return name;
}

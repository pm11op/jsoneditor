/*  XPath for jQuery @VERSION
 *  (c) 2007 Cybozu Labs, Inc.
 *
 *  XPath for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the JavaScript-XPath web site: http://coderepos.org/share/wiki/JavaScript-XPath
 *
/*--------------------------------------------------------------------------*/

if (window.jQuery && !jQuery.xpath) (function(jq, fn) {


    var init = fn.init;
    var rxXPath = /^[\s\(]*(\/|\w*)/;

    var xpathFunctionNames = [
        'context-node',
        'root-node',
        'last',
        'position',
        'count',
        'id',
        'local-name',
        'name',
        'namespace-uri',
        'string',
        'concat',
        'starts-with',
        'contains',
        'substring',
        'substring-before',
        'substring-after',
        'string-length',
        'normalize-space',
        'translate',
        'boolean',
        'not',
        'true',
        'false',
        'lang',
        'number',
        'sum',
        'floor',
        'ceiling',
        'round',
        '/'
    ];

    var xpathFunctionNameHash = {};

    for (var i = 0, l = xpathFunctionNames.length; i < l; i ++)
        xpathFunctionNameHash[xpathFunctionNames[i]] = true;

    // type is String or Number or Booleaen or Array or undefined
    var xpath = function (expr, context, type, ordered) {
        var i, result, nodes;

        context = context || document;
        expr    = document.createExpression(expr, null);

        switch (type) {
            case Number:  return expr.evaluate(context, 1, null).numberValue;
            case String:  return expr.evaluate(context, 2, null).stringValue;
            case Boolean: return expr.evaluate(context, 3, null).booleanValue;
            case Array: {
                if (ordered)
                    result = expr.evaluate(context, 7, null);
                else
                    result = expr.evaluate(context, 6, null);
                nodes = [];
                for (i = 0, l = result.snapshotLength; i < l; i ++)
                    nodes.push(result.snapshotItem(i));
                return nodes;
            }
            default: {
                if (ordered) {
                    result = expr.evaluate(context, 7, null);
                    nodes = [];
                    for (i = 0, l = result.snapshotLength; i < l; i ++)
                        nodes.push(result.snapshotItem(i));
                    return nodes;
                }
                else {
                    result = expr.evaluate(context, 0, null);
                    switch (result.resultType) {
                        case 1: return result.numberValue;
                        case 2: return result.stringValue;
                        case 3: return result.booleanValue;
                        case 4: {
                            nodes = [];
                            while (i = result.iterateNext()) {
                                nodes.push(i);
                            }
                            return nodes;
                        }
                    }
                }
            }
        }
    };

    function resolveArgs(expr, context, type, ordered) {
        switch (typeof context) {
            case 'function':
                ordered = type;
                type = context;
                context = undefined;
                break;
            case 'boolean':
                ordered = context;
                type = undefined;
                context = undefined;
                break;
        }

        if (typeof type == 'boolean') {
            ordered = type;
            type = undefined;
        }
        return [expr, context, type, ordered];
    }

    // type is String or Number or Booleaen or Array or undefined
    // $(expr)
    // $(expr, context)
    // $(expr, type)
    // $(expr, ordered)
    // $(expr, context, type)
    // $(expr, context, ordered)
    // $(expr, type, ordered)
    // $(expr, context, type, ordered)
    jq.x = function(expr, context, type, ordered) {
        var args = resolveArgs(expr, context, type, ordered);
        return xpath.apply(jq, args);
    };

    // type is String or Number or Booleaen or Array or undefined
    // $(expr)
    // $(expr, context)
    // $(expr, type)
    // $(expr, ordered)
    // $(expr, context, type)
    // $(expr, context, ordered)
    // $(expr, type, ordered)
    // $(expr, context, type, ordered)
    fn.init = function(expr, context, type, ordered) {
        if (expr && typeof expr == 'string' && rxXPath.test(expr) && xpathFunctionNameHash[RegExp.$1]) {
            var args = resolveArgs(expr, context, type, ordered);
            return new jq(args[1]).xfind(args[0], args[2], args[3]);
        }

        return init.apply(this, arguments);
    };
    fn.init.prototype = init.prototype;

    // .xfind(expr)
    // .xfind(expr, ordered)
    fn.xfind = function (expr, type, ordered) {
        if (typeof type == 'boolean') {
            ordered = type;
            type = undefined;
        }
        return  this.pushStack(
            jq.map(this, function (node) {
                return xpath.call(jq, expr, node, type, ordered)
            })
        );
    };

})(jQuery, jQuery.fn);

if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

// next two from: https://github.com/tc39/proposal-object-values-entries/blob/master/polyfill.js
var reduce = Function.bind.call(Function.call, Array.prototype.reduce);
var isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
var concat = Function.bind.call(Function.call, Array.prototype.concat);
var keys = function(target) {
    return Object.getOwnPropertyNames(target).
    concat(Object.getOwnPropertySymbols(target));
}
if (!Object.values) {
    Object.values = function values(O) {
        return reduce(keys(O), function (v, k) {
            return concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []);
        }, []);
    };
}

if (!Object.entries) {
    Object.entries = function entries(O) {
        return reduce(keys(O), function (e, k) {
            return concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []);
        }, []);
    };
}

Object.filter = function(obj, predicate) {
    var result = {}, key;
    for (key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (typeof obj[key] === 'object') {
            var f = Object.filter(obj[key], predicate);
            if (typeof f === 'object' && Object.keys(f).length > 0) result[key] = f;
        } else if (predicate(obj)) {
            result = obj;
        }
    }
    return result;
};

// flatten an object, send a string to prepend that matches the key that should be used
// e.g: Object.flatten(complexObject, 'guest_id');
Object.flatten = function(obj, prepend) {
    var result = {};
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (typeof obj[key] === 'object') {
            var flatObject = Object.flatten(obj[key], prepend);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                if (flatObject[prepend] == null) {
                    result[x] = flatObject[x];
                } else {
                    if (result[flatObject[prepend]] == null) result[flatObject[prepend]] = {};
                    result[flatObject[prepend]][x] = flatObject[x];
                }
            }
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};

Object.extend = function(src, _visited) {
    if(src == null || typeof(src) !== 'object'){
        return src;
    }
    // Initialize the visited objects array if needed
    // This is used to detect cyclic references
    if (_visited == undefined){
        _visited = [];
    }
    // Otherwise, ensure src has not already been visited
    else {
        var i, len = _visited.length;
        for (i = 0; i < len; i++) {
            // If src was already visited, don't try to copy it, just return the reference
            if (src === _visited[i]) {
                return src;
            }
        }
    }
    // Add this object to the visited array
    _visited.push(src);

    //Honor native/custom clone methods
    if(typeof src.clone == 'function'){
        return src.clone(true);
    }

    //Special cases:
    //Array
    if (Object.prototype.toString.call(src) == '[object Array]') {
        //[].slice(0) would soft clone
        ret = src.slice();
        var i = ret.length;
        while (i--){
            ret[i] = Object.extend(ret[i], _visited);
        }
        return ret;
    }
    //Date
    if (src instanceof Date){
        return new Date(src.getTime());
    }
    //RegExp
    if(src instanceof RegExp){
        return new RegExp(src);
    }
    //DOM Elements
    if(src.nodeType && typeof src.cloneNode == 'function'){
        return src.cloneNode(true);
    }

    //If we've reached here, we have a regular object, array, or function

    //make sure the returned object has the same prototype as the original
    var proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src): src.__proto__);
    if (!proto) {
        proto = src.constructor.prototype; //this line would probably only be reached by very old browsers
    }
    var ret = Object.create(proto);

    for(var key in src){
        //Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
        //For an example of how this could be modified to do so, see the singleMixin() function
        ret[key] = Object.extend(src[key], _visited);
    }
    return ret;
}

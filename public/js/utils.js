"use strict";

function waitUntil(condition, callback) {
    if (condition()) {
        callback();
        return;
    }
    setTimeout(() => waitUntil(condition, callback), 250);
}

function jqueryFnDefined(func) {
    if (typeof func === "string") {
        return typeof $.fn[func] !== 'undefined';
    }
    return func.every(jqueryFnDefined);
}

function isDefined(object) {
    return typeof object !== 'undefined';
}

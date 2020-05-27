function waitUntil(condition, callback) {
    if (condition()) {
        callback();
    } else {
        setTimeout(() => {
            waitUntil(condition, callback);
        }, 250);
    }
}

function jqueryFnDefined(func) {
    if (typeof func === "string") {
        return typeof $.fn[func] !== 'undefined';
    } else {
        return func.every(jqueryFnDefined);
    }
}

function isDefined(object) {
    return typeof object !== 'undefined';
}

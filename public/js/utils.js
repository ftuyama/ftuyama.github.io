function waitUntil(condition, callback) {
    if (condition()) {
        callback();
    } else {
        setInterval(() => {
            waitUntil(condition, callback);
        }, 500);
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

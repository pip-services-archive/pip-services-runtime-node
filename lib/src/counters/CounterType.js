"use strict";
(function (CounterType) {
    CounterType[CounterType["Interval"] = 0] = "Interval";
    CounterType[CounterType["LastValue"] = 1] = "LastValue";
    CounterType[CounterType["Statistics"] = 2] = "Statistics";
    CounterType[CounterType["Timestamp"] = 3] = "Timestamp";
    CounterType[CounterType["Increment"] = 4] = "Increment";
})(exports.CounterType || (exports.CounterType = {}));
var CounterType = exports.CounterType;
;

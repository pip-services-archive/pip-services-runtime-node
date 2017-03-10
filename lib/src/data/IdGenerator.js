"use strict";
var shortid = require('shortid');
var uuid = require('node-uuid');
// Maps for number <-> hex string conversion
var byteToHex = [];
for (var i = 0; i < 256; i++) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}
var IdGenerator = (function () {
    function IdGenerator() {
    }
    IdGenerator.short = function () {
        return shortid.generate();
    };
    IdGenerator.short2 = function () {
        return Math.random().toString(36).substr(2, 10); // remove `0.`
    };
    IdGenerator.uuidToHex = function (buffer) {
        return byteToHex[buffer[0]] + byteToHex[buffer[1]]
            + byteToHex[buffer[2]] + byteToHex[buffer[3]]
            + byteToHex[buffer[4]] + byteToHex[buffer[5]]
            + byteToHex[buffer[6]] + byteToHex[buffer[7]]
            + byteToHex[buffer[8]] + byteToHex[buffer[9]]
            + byteToHex[buffer[10]] + byteToHex[buffer[11]]
            + byteToHex[buffer[12]] + byteToHex[buffer[13]]
            + byteToHex[buffer[14]] + byteToHex[buffer[15]];
    };
    IdGenerator.uuid = function () {
        var buffer = new Array(16);
        return IdGenerator.uuidToHex(uuid.v4(null, buffer));
    };
    return IdGenerator;
}());
exports.IdGenerator = IdGenerator;

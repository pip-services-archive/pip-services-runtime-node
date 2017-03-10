"use strict";
var _ = require('lodash');
var MicroserviceError_1 = require('../errors/MicroserviceError');
var ResponseSender = (function () {
    function ResponseSender() {
    }
    ResponseSender.sendError = function (req, res, error) {
        error = error || {};
        error = MicroserviceError_1.MicroserviceError.unwrap(error);
        var result = _.pick(error, 'code', 'status', 'name', 'details', 'component', 'message', 'stack', 'cause');
        result = _.defaults(result, { code: 'Undefined', status: 500, message: 'Unknown error' });
        res.status(result.status);
        res.json(result);
    };
    ResponseSender.sendResult = function (req, res) {
        return function (err, result) {
            if (err) {
                ResponseSender.sendError(req, res, err);
                return;
            }
            if (result == null)
                res.send(204);
            else
                res.json(result);
        };
    };
    ResponseSender.sendCreatedResult = function (req, res) {
        return function (err, result) {
            if (err) {
                ResponseSender.sendError(req, res, err);
                return;
            }
            if (result == null)
                res.status(204);
            else {
                res.status(201);
                res.json(result);
            }
        };
    };
    ResponseSender.sendDeletedResult = function (req, res) {
        return function (err, result) {
            if (err) {
                ResponseSender.sendError(req, res, err);
                return;
            }
            if (result == null)
                res.status(204);
            else {
                res.status(200);
                res.json(result);
            }
        };
    };
    return ResponseSender;
}());
exports.ResponseSender = ResponseSender;

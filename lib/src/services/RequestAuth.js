"use strict";
var _ = require('lodash');
var UnauthorizedError_1 = require('../errors/UnauthorizedError');
var BadRequestError_1 = require('../errors/BadRequestError');
var ResponseSender_1 = require('./ResponseSender');
var RequestAuth = (function () {
    function RequestAuth() {
    }
    // Allow anybody who entered the system
    RequestAuth.anybody = function (req, res, next) {
        next();
    };
    // Allow only registered and authenticated users
    RequestAuth.user = function (req, res, next) {
        if (!req.user) {
            ResponseSender_1.ResponseSender.sendError(req, res, new UnauthorizedError_1.UnauthorizedError('NotAuthenticated', 'User is not authenticated'));
        }
        else
            next();
    };
    ;
    // Allow only the user himself
    RequestAuth.owner = function (req, res, next) {
        if (req.params.userId == null) {
            ResponseSender_1.ResponseSender.sendError(req, res, new BadRequestError_1.BadRequestError('NoUserId', 'User id is not defined'));
        }
        else if (!req.user) {
            ResponseSender_1.ResponseSender.sendError(req, res, new UnauthorizedError_1.UnauthorizedError('NotAuthenticated', 'User is not authenticated'));
        }
        else if (req.user.id != req.params.userId) {
            ResponseSender_1.ResponseSender.sendError(req, res, new UnauthorizedError_1.UnauthorizedError('NotOwner', 'Only owner access is allowed'));
        }
        else
            next();
    };
    ;
    return RequestAuth;
}());
exports.RequestAuth = RequestAuth;

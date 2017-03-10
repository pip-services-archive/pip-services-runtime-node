let _ = require('lodash');

import { UnauthorizedError } from '../errors/UnauthorizedError';
import { BadRequestError } from '../errors/BadRequestError';
import { ResponseSender } from './ResponseSender';

export class RequestAuth {
    
    // Allow anybody who entered the system
    public static anybody(req, res, next) {
        next();
    }

    // Allow only registered and authenticated users
    public static user(req, res, next) {
        if (!req.user) {
            ResponseSender.sendError(
                req, res, 
                new UnauthorizedError('NotAuthenticated', 'User is not authenticated')
            );
        } else next();
    };

    // Allow only the user himself
    public static owner(req, res, next) {
        if (req.params.userId == null) {
            ResponseSender.sendError(
                req, res, 
                new BadRequestError('NoUserId', 'User id is not defined')
            );
        } else if (!req.user) {
            ResponseSender.sendError(
                req, res, 
                new UnauthorizedError('NotAuthenticated', 'User is not authenticated')
            );
        } else if (req.user.id != req.params.userId) {
            ResponseSender.sendError(
                req, res, 
                new UnauthorizedError('NotOwner', 'Only owner access is allowed')
            );
        } else next();
    };
    
}

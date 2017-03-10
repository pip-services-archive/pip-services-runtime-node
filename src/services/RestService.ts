let _ = require('lodash');

import { AbstractService } from './AbstractService';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentSet } from '../ComponentSet';
import { DynamicMap } from '../portability/DynamicMap';
import { ComponentConfig } from '../config/ComponentConfig';
import { State } from '../State';
import { ResponseSender } from './ResponseSender';
import { ConfigError } from '../errors/ConfigError';
import { ConnectionError } from '../errors/ConnectionError';
import { StateError } from '../errors/StateError';

/**
 * Interoperable REST service that exposes a specific version of 
 * a microservice API via HTTP/HTTPS endpoint to consumers.  
 *
 * This implementation uses restify library to define RESTful API.
 * Authors of specific REST services must register in descendant classes 
 * API routes using <b>registerRoute</b> in overriden <b>link</b> 
 * or <b/>register</b> methods.
 *  
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-06
 */
export abstract class RestService extends AbstractService {
	private static DefaultConfig = DynamicMap.fromTuples(
        "endpoint.protocol", "http",
        "endpoint.host", "0.0.0.0",
        //"endpoint.port", 3000,
		"options.request_max_size", 1024 * 1024,
        "options.connect_timeout", 60000,
        "options.debug", true
	); 

    protected _server: any;
    
	/**
	 * Creates instance of abstract REST service.
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }

	/**
	 * Sets component configuration parameters and switches component
	 * to 'Configured' state. The configuration is only allowed once
	 * right after creation. Attempts to perform reconfiguration will 
	 * cause an exception.
	 * @param config the component configuration parameters.
	 * @throws MicroserviceError when component is in illegal state 
	 * or configuration validation fails. 
	 */
	public configure(config: ComponentConfig) {
    	this.checkNewStateAllowed(State.Configured);
    	
    	config = config.withDefaults(RestService.DefaultConfig);
        let endpoint = config.getEndpoint();

        if (endpoint == null)
            throw new ConfigError(this, 'NoEndpoint', 'Endpoint is not configured');

        let protocol = endpoint.getProtocol();
        if (protocol != 'http')
            throw new ConfigError(this, 'UnsupportedProtocol', protocol + ' protocol is not supported by REST transport')
                .withDetails(protocol)

        if (endpoint.getPort() == null)
            throw new ConfigError(this, 'NoPort', 'No port is configured in REST transport');
    	        
        super.configure(config);
	}
    
	/**
	 * Sets references to other microservice components to enable their 
	 * collaboration. It is recommended to locate necessary components
	 * and cache their references to void performance hit during
	 * normal operations. 
	 * Linking can only be performed once after configuration 
	 * and will cause an exception when it is called second time 
	 * or out of order. 
     * @param context application context
	 * @param components references to microservice components.
	 * @throws MicroserviceError when requires components are not found.
	 */
    public link(context: DynamicMap, components: ComponentSet): void {                                
    	this.checkNewStateAllowed(State.Linked);

        // Create instance of express application   
        let restify = require('restify'); 
        let options = this._config.getOptions();
        this._server = restify.createServer({}); // options);
        
        // Configure express application
        this._server.use(restify.acceptParser(this._server.acceptable));
        //this._server.use(restify.authorizationParser());
        this._server.use(restify.CORS());
        this._server.use(restify.dateParser());
        this._server.use(restify.queryParser());
        this._server.use(restify.jsonp());
        this._server.use(restify.gzipResponse());
        this._server.use(restify.bodyParser());
        //this._server.use(restify.requestExpiry());

        if (options.get("throttle") != null)
            this._server.use(restify.throttle(options.get("throttle")));

        this._server.use(restify.conditionalRequest());

        // Register (add) express routes
        this.register();
        
        super.link(context, components);
    }

	/**
	 * Opens the component, performs initialization, opens connections
	 * to external services and makes the component ready for operations.
	 * Opening can be done multiple times: right after linking 
	 * or reopening after closure.
	 * @param callback a callback to report success or error in opening  
	 */
    public open(callback: (err: any) => void): void {
    	this.checkNewStateAllowed(State.Opened);

        let endpoint = this._config.getEndpoint();

        this._server.listen(
            endpoint.getPort(), 
            endpoint.getHost(),
            (err) => {
                if (err == null) {
                    this.info(null, 'REST service started listening at ' + endpoint.getUri());
                    super.open(callback);
                } else {
                    err = new ConnectionError(this, 'ConnectFailed', 'Opening REST service failed', err);                    
                    callback(err);
                }
            }
        );
    }
    
	/**
	 * Closes the component and all open connections, performs deinitialization
	 * steps. Closure can only be done from opened state. Attempts to close
	 * already closed component or in wrong order will cause exception.
	 * @param callback a callback to report success or error in closing  
	 */
    public close(callback: (err: any) => void): void {
    	this.checkNewStateAllowed(State.Closed);

        if (this._server == null) {
            super.close(callback);
            return;
        }

        // Todo: callback is not fired        
        // this._server.close((err) => {
        //     this._server = null; // Shall we loose reference when error happen?
        //     callback(err); 
        // });
        
        this._server.close();
        this._server = null;
        
        callback(null);
    } 

    /**
     * Sends results with 200 status codes 
     * and <b>nulls</b> with 404 statuses.
     * @param req a request object
     * @param res a response object
     * 
     */
    protected sendResult(req, res): (err: any, result: any) => void {
        return ResponseSender.sendResult(req, res);
    }

    protected sendCreatedResult(req, res): (err: any, result: any) => void {
        return ResponseSender.sendCreatedResult(req, res);
    }

    protected sendDeletedResult(req, res): (err: any, result: any) => void {
        return ResponseSender.sendDeletedResult(req, res);
    }

    protected sendError(req, res, error): void {
        ResponseSender.sendError(req, res, error);
    }

    protected registerRoute(method: string, route: string, handler: any, intercept?: any): void {
        method = method.toLowerCase();
        if (method == 'delete') method = 'del';
                
        // Wrapping to preserve "this"
        let self = this;
        if (intercept) {
           this._server[method](route,
                (req, res, next) => {
                    return intercept.call(self, req, res, next);
                }, 
                (req, res, next) => {
                    handler.call(self, req, res);
                    return next();
                }
           );
        } else { 
            this._server[method](route, 
                (req, res, next) => {
                    handler.call(self, req, res);
                    return next();
                }
            );
        }
    }    
    
    protected register(): void {}
}

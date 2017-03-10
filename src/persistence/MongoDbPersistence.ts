let _ = require('lodash');

import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentSet } from '../ComponentSet';
import { DynamicMap } from '../portability/DynamicMap';
import { ComponentConfig } from '../config/ComponentConfig';
import { State } from '../State';
import { ConfigError } from '../errors/ConfigError';
import { ConnectionError } from '../errors/ConnectionError';
import { AbstractPersistence } from './AbstractPersistence';
import { FilterParams } from '../data/FilterParams';
import { PagingParams } from '../data/PagingParams';
import { DataPage } from '../data/DataPage';

export abstract class MongoDbPersistence extends AbstractPersistence {
	private static DefaultConfig = DynamicMap.fromTuples(
        "connection.type", "mongodb",
        "connection.host", "localhost",
        "connection.port", 27017,
		"options.server.pollSize", 4,
        "options.server.socketOptions.keepAlive", 1,
        "options.server.socketOptions.connectTimeoutMS", 5000,
        "options.server.auto_reconnect", true,
        "options.max_page_size", 100,
        "options.debug", true
	); 

    protected _connection: any;
    protected _maxPageSize: number;
    protected _model: any;
    protected _converter: any;
    protected _listConverter: any;
    
    constructor(descriptor: ComponentDescriptor, model: any) {
        super(descriptor);

        this._model = model;
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
    	
    	config = config.withDefaults(MongoDbPersistence.DefaultConfig);
        let connection = config.getConnection();
        let options = config.getOptions();
    	
        if (connection == null)
            throw new ConfigError(this, "NoConnection", "Database connection is not set");

        if (connection.getType() != "mongodb")
            throw new ConfigError(this, "WrongConnectionType", "MongoDb is the only supported connection type");

        if (connection.getHost() == null)
            throw new ConfigError(this, "NoConnectionHost", "Connection host is not set");

        if (connection.getPort() == null)
            throw new ConfigError(this, "NoConnectionPort", "Connection port is not set");

        if (connection.getDatabase() == null)
            throw new ConfigError(this, "NoConnectionDatabase", "Connection database is not set");
        
        super.configure(config);

        this._maxPageSize = options.getInteger("max_page_size");
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
    public link(context: DynamicMap, components: ComponentSet) {
    	this.checkNewStateAllowed(State.Linked);

        this._connection = require('mongoose').createConnection();

        if (_.isString(this._model)) 
            this._model = require(this._model);

        if (_.isFunction(this._model)) 
            this._model = this._model(this._connection);

        this._converter = this.convertItem;
        this._listConverter = this.convertListItem;

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

        let connection = this._config.getConnection();
        let uri = connection.getType() + '://' + connection.getHost() 
            + ':' + connection.getPort() + '/' + connection.getDatabase();
        let options = this._config.getOptions();
        this.trace(null, 'Connecting to mongodb at ' + uri);
        
        this._connection.open(
            uri, 
            options, 
            (err) => {
                if (err) {
                    err = new ConnectionError(this, 'ConnectFailed', 'Connection to mongodb failed: ' + err)
                        .wrap(err);                    
                    callback(err);
                } else super.open(callback);
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

        this._connection.close((err) => {
            if (err) {
                err = new ConnectionError(this, 'DisconnectFailed', 'Disconnect from mongodb failed: ' + err)
                    .wrap(err);
                callback(err);
            } else super.close(callback);
        });
    }

    public clearTestData(callback: (err: any) => void): void {
        this._connection.db.dropDatabase(callback);
    }

    protected getPage(correlationId: string, filter: FilterParams, paging: PagingParams, sort: any, select: any, callback: any): void {                               
        // Adjust max item count based on configuration
        paging = paging || new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);
        let pagingEnabled = paging.total;

        // Configure statement
        let statement = this._model.find(filter);

        if (skip >= 0) statement.skip(skip);
        statement.limit(take);
        if (sort && !_.isEmpty(sort)) statement.sort(sort);
        if (select && !_.isEmpty(select)) statement.select(select);

        statement.exec((err, items) => {
            if (err) {
                callback(err);
                return;
            }

            if (this._listConverter) 
                items = _.map(items, this._listConverter);
            else items = _.map(items, this.jsonToPublic);

            if (pagingEnabled) {
                this._model.count(filter, (err, count) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                        
                    let page = new DataPage(items, count);
                    callback(null, page.toObject());
                });
            } else {
                let page = new DataPage(items);
                callback(null, page.toObject());
            }
        });
    }

    protected getList(correlationId: string, filter: any, sort: any, select: any, callback): void {                
        // Configure statement
        let statement = this._model.find(filter);

        if (sort && !_.isEmpty(sort)) statement.sort(sort);
        if (select && !_.isEmpty(select)) statement.select(select);

        statement.exec((err, items) => {
            if (err) {
                callback(err);
                return;
            }

            if (this._listConverter) 
                items = _.map(items, this._listConverter);
            else items = _.map(items, this.jsonToPublic);

            callback(null, items);
        });
    }

    protected getRandom(correlationId: string, filter: any, callback: any): void {            
        this._model.count(filter, (err, count) => {
            if (err) {
                callback(err);
                return;
            }

            var pos = _.random(0, count - 1);

            this._model.find(filter)
                .skip(pos)
                .limit(1)
                .exec((err, items) => {
                    let item = (items != null && items.length > 0) ? items[0] : null;
                    
                    if (item) {
                        if (this._converter) 
                            item = this._converter(item);
                        else item = this.jsonToPublic(item);
                    }

                    callback(err, item);
                });
        });
    }

    protected getById(correlationId: string, id: string, callback: any): void {
        this._model.findById(
            id, 
            (err, item) => {
                if (item) {
                    if (this._converter) 
                        item = this._converter(item);
                    else item = this.jsonToPublic(item);
                }
                
                callback(err, item);
            }
        );
    }

    protected create(correlationId: string, item: any, callback: any): void {
        let newItem = _.omit(item, 'id');
            
        newItem._id = item.id || this.createUuid();

        this._model.create(
            newItem, 
            (err, item) => {
                if (item) {
                    if (this._converter) 
                        item = this._converter(item);
                    else item = this.jsonToPublic(item);
                }

                callback(err, item);
            }
        );
    }

    protected update(correlationId: string, id: string, newItem: any, callback: any): void {
        newItem = _.omit(newItem, '_id', 'id');

        this._model.findByIdAndUpdate(
            id,
            { $set: newItem },
            { 'new': true },
            (err, item) => {
                if (item) {
                    if (this._converter) 
                        item = this._converter(item);
                    else item = this.jsonToPublic(item);
                }

                callback(err, item);
            }
        );
    }

    // The method must return deleted value to be able to do clean up like removing references 
    protected delete(correlationId: string, id: string, callback: any): void {
        this._model.findByIdAndRemove(
            id, 
            (err, item) => {
                if (item) {
                    if (this._converter) 
                        item = this._converter(item);
                    else item = this.jsonToPublic(item);
                }

                callback(err, item);
            }
        );
    }

    // Convert object to JSON format
    protected jsonToPublic(value: any): any {
        if (value && value.toJSON)
            value = value.toJSON();
        return value;
    }    

    protected convertItem(value: any): any {
        if (value && value.toJSON)
            value = value.toJSON();
        return value;
    }

    protected convertListItem(value: any): any {
        if (value == null) return null;
        
        if (value.toJSON)
            value = value.toJSON();
        
        return _.omit(value, 'custom_dat');
    }
}

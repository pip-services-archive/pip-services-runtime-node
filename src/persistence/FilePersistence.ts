let _ = require('lodash');
let fs = require('fs');

import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { DynamicMap } from '../portability/DynamicMap';
import { ComponentConfig } from '../config/ComponentConfig';
import { State } from '../State';
import { ConfigError } from '../errors/ConfigError';
import { AbstractPersistence } from './AbstractPersistence';
import { DataPage } from '../data/DataPage';
import { FilterParams } from '../data/FilterParams';
import { PagingParams } from '../data/PagingParams';

export abstract class FilePersistence extends AbstractPersistence {
	private static DefaultConfig = DynamicMap.fromTuples(
		"options.max_page_size", 100
	); 

    protected _path: any;
    protected _initialData: any;
    protected _maxPageSize: number;
    protected _items: any[] = [];
    protected _converter: any;
    protected _listConverter: any;
    
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
        
        this._converter = this.convertItem;
        this._listConverter = this.convertListItem;
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
    	
    	config = config.withDefaults(FilePersistence.DefaultConfig);
        let options = config.getOptions();
    	
        if (options.hasNot("path"))
            throw new ConfigError(this, "NoPath", "Data file path is not set");
        
        super.configure(config);

        this._path = options.getString("path");
        this._maxPageSize = options.getInteger("max_page_size");
        this._initialData = options.get("data");
	}
    
	/**
	 * Opens the component, performs initialization, opens connections
	 * to external services and makes the component ready for operations.
	 * Opening can be done multiple times: right after linking 
	 * or reopening after closure.
	 * @param callback a callback to report success or error in opening  
	 */
    public open(callback: (err: any) => void): void {        
        if (_.isArray(this._initialData)) {
            // Fill with predefined data (for testing)
            this._items = _.cloneDeep(this._initialData);
            super.open(callback);
        } else {
            this.load((err) => {
                if (err) callback(err);
                else super.open(callback);
            })
        }
    }
    
	/**
	 * Closes the component and all open connections, performs deinitialization
	 * steps. Closure can only be done from opened state. Attempts to close
	 * already closed component or in wrong order will cause exception.
	 * @param callback a callback to report success or error in closing  
	 */
    public close(callback: (err: any) => void): void {
        this.save((err) => {
            if (err) callback(err);
            else super.close(callback);
        });
    }

    public load(callback: (err: any) => void): void {
        this.trace(null, 'Loading data from file at ' + this._path);
        
        fs.readFile(this._path, (err, data) => {
            if (err) {
                // If doesn't exist then consider empty data
                if (err.code == 'ENOENT') {
                    err = null;
                    this._items = [];
                }
                callback(err);
            } else {
                data = (data || '').toString();
                data = JSON.parse(data) || [];
                if (!_.isArray(data)) data = [data];
                this._items = data;
                
                callback(null);
            }
        });
    }

    public save(callback: (err: any) => void): void {
        this.trace(null, 'Saving data to file at ' + this._path);
        let data = JSON.stringify(this._items);
        fs.writeFile(this._path, data, callback);
    }

    public clearTestData(callback: (err: any) => void): void {
        this._items = [];
        this.save(callback);
    }

    protected getPage(correlationId: string, filter: any, paging: PagingParams, sort: any, select: any, callback: any): void {
        var items = this._items;
        
        // Filter and sort
        if (filter) items = _.filter(items, filter);
        if (sort) items = _.sortBy(items, sort); 

        // Prepare paging parameters        
        paging = paging || new PagingParams();        
        let skip = paging.getSkip(-1);        
        let take = paging.getTake(this._maxPageSize);        
        
        // Get a page
        let pageItems = (skip > 0) 
            ? _.slice(items, skip, skip + take)
            : _.take(items, take);               
                
        // Convert values
        if (this._listConverter)
            pageItems = _.map(pageItems, this._listConverter);
        if (select)
            pageItems = _.map(pageItems, select);
                
        // Return a page
        let page = new DataPage(pageItems, items.length);
        callback(null, page.toObject());
    }

    protected getList(correlationId: string, filter: any, sort: any, select: any, callback: any): void {
        var items = this._items;

        // Filter and sort        
        if (filter) items = _.filter(items, filter);
        if (sort) items = _.sortBy(items, sort); 
                          
        // Convert values      
        if (this._listConverter)
            items = _.map(items, this._listConverter);
        if (select)
            items = _.map(items, select);
                
        // Return a list
        callback(null, items);
    }
    
    protected getRandom(correlationId: string, filter: any, callback: any): void {
        var items = this._items;
        
        if (filter) items = _.filter(items, filter);

        let item = _.sample(items);

        if (item && this._converter) 
            item = this._converter(item);

        callback(null, item);
    }

    protected getById(correlationId: string, id: any, callback: any): void {
        let item = _.find(
            this._items, 
            (item) => item && item.id == id
        );
        
        if (item && this._converter) 
            item = this._converter(item);
            
        callback(null, item);
    }

    protected create(correlationId: string, item: any, callback: any): void {
        // Create the item
        item.id = item.id || this.createUuid();
        this._items.push(item);

        // Save the item collection
        this.save((err) => {
            if (item && this._converter) 
                item = this._converter(item);

            if (err) callback(err);
            else callback(null, item);
        });
    }

    protected update(correlationId: string, id: any, newItem: any, callback: any): void {
        // Get the item        
        let item = _.find(
            this._items, 
            (item) => item && item.id == id
        );
        
        if (item == null) {
            callback(null, null);
            return;
        }
        
        // Update the item
        newItem = _.omit(newItem, 'id');
        _.assign(item, newItem);
        
        // Save item collection
        this.save((err) => {
            if (item && this._converter) 
                item = this._converter(item);
            
            if (err) callback(err);
            else callback(null, item);
        });
    }

    // The method must return deleted value to be able to do clean up like removing references 
    protected delete(correlationId: string, id: any, callback: any): void {
        // Delete the item(s)
        let deletedItems = _.remove(
            this._items, 
            (item) => item && item.id == id
        );
        
        // Exit if nothing was deleted
        if (deletedItems == null && deletedItems.length == 0) {
            callback(null);
            return;
        }
                        
        // Save item collection
        this.save((err) => {
            if (err) callback(err);
            else {
                let item = deletedItems[0];

                if (item && this._converter) 
                    item = this._converter(item);

                callback(null, item);
            }
        });
    }

    protected convertItem(item: any): any {
        return item;
    }

    protected convertListItem(item: any): any {
        if (item) return _.omit(item, 'custom_dat');
        else return null;
    }

}

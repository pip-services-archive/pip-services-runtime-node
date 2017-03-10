let _ = require('lodash');

import { ComponentSet } from '../ComponentSet';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentConfig } from '../config/ComponentConfig';
import { AbstractClient } from './AbstractClient';
import { Endpoint } from '../config/Endpoint';
import { DynamicMap } from '../portability/DynamicMap';
import { IdGenerator } from '../data/IdGenerator';
import { ConfigError } from '../errors/ConfigError';
import { UnknownError } from '../errors/UnknownError';
import { CallError } from '../errors/CallError';

export abstract class LambdaClient extends AbstractClient {
    private static DefaultConfig = DynamicMap.fromTuples(
        'endpoint.protocol', 'aws',
        'endpoint.function', null,
        'endpoint.region', null,

        'options.access_key_id', null,
        'options.secret_access_key', null, 
        'options.timeout', 30000
    );

    private _endpoint: Endpoint;
    private _lambda;

    private _protocol: string;
    private _function: string;
    private _region: string;
    private _accessKeyId: string;
    private _secretAccessKey: string;
    private _timeout: number;
    
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
	public configure(config: ComponentConfig): void {
        config = config.withDefaults(LambdaClient.DefaultConfig);

        let endpoint = config.getEndpoint();
        let options = config.getOptions();

        this._protocol = endpoint.getProtocol();
        if (this._protocol != 'aws') 
            throw new ConfigError(this, 'UnsupportedProtocol', 'Protocol type is not supported by Lambda transport')
                .withDetails(this._protocol);
        
        this._function = endpoint.getRawContent().getNullableString('function');
        if (this._function == '')
            throw new ConfigError(this, 'NoFunction', 'Function is missing in lamda transport configuration');

        this._region = endpoint.getRawContent().getNullableString('region');
        if (this._region == '')
            throw new ConfigError(this, 'NoRegion', 'Region is missing in lamda transport configuration');

        this._accessKeyId = options.getNullableString('access_key_id');
        if (this._accessKeyId == '')
            throw new ConfigError(this, 'NoAccessKeyId', 'AccessKeyId is missing in lamda transport configuration');
            
        this._secretAccessKey = options.getNullableString('secret_access_key');
        if (this._secretAccessKey == '') 
            throw new ConfigError(this, 'NoSecretAccessKey', 'SecretAccessKey is missing  in lamda transport configuration');

        super.configure(config);

        this._timeout = options.getInteger('timeout'); 
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
        let aws = require('aws-sdk');
        
        aws.config.update({
            accessKeyId: this._accessKeyId,
            secretAccessKey: this._secretAccessKey,
            region: this._region
        });

        aws.config.httpOptions = {
            timeout: this._timeout
        };

        this._lambda = new aws.Lambda();

        super.link(context, components);
    }

    protected invoke(invocationType: string, cmd: string, correlationId: string, args: any, callback: (err: any, result: any) => void): void {
        args = _.clone(args);        

        args.cmd = cmd;
        if (args.cmd == null) 
            throw new UnknownError(this, 'NoCommand', 'Missing pattern cmd');

        correlationId = correlationId || IdGenerator.short();
        args.correlation_id = correlationId;

        let params = {
            FunctionName: this._function,
            InvocationType: invocationType,
            LogType: 'None',
            Payload: JSON.stringify(args)
        }                        
                        
        this._lambda.invoke(params, (err, data) => {
            if (callback == null) {
                if (err) this.error(null, err);
                return;
            }
            
            if (err) {
                err = new CallError(this, 'CallFailed', 'Failed to invoke lambda function')
                    .withCause(err);

                callback(err, null);
            } else {
                let result: any = data.Payload;
                if (_.isString(result)) {
                    try {
                        result = JSON.parse(result);
                    } catch (err) {
                        err = new CallError(this, 'SerializationFailed', 'Failed to deserialize result')
                            .withCause(err);

                        callback(err, null);
                        return;
                    }
                }
                callback(null, result);
            }
        });
    }    

    protected call(cmd: string, correlationId?: string, params: any = {}, callback?: (err: any, result: any) => void): void {
        this.invoke('RequestResponse', cmd, correlationId, params, callback);
    }

    protected callOneWay(cmd: string, correlationId?: string, params: any = {}, callback?: (err: any, result: any) => void): void {
        this.invoke('Event', cmd, correlationId, params, callback);
    }
}

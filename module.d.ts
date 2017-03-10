declare module 'pip-services-runtime-node' {

    //*************** Portability ***************

	export class DynamicMap {
        constructor(map?: any);
        public get(propName: string): any;
        public has(propName: string): boolean;
        public hasNot(propName: string): boolean;
        public getNullableMap(propName: string): DynamicMap;
        public getMap(propName: string): DynamicMap;
        public getMapWithDefault(propName: string, defaultValue: DynamicMap): DynamicMap;
        public getNullableArray(path: string): any[];
        public getArray(path: string): any[];
        public getArrayWithDefault(path: string, defaultValue: any[]): any[];
        public getNullableString(propName: string): string;
        public getString(propName: string): string;
        public getStringWithDefault(propName: string, defaultValue: string): string;
        public getNullableBoolean(propName: string): boolean;
        public getBoolean(propName: string): boolean;
        public getBooleanWithDefault(propName: string, defaultValue: boolean): boolean;
        public getNullableInteger(propName: string): number;
        public getInteger(propName: string): number;
        public getIntegerWithDefault(propName: string, defaultValue: number): number;
        public getNullableLong(propName: string): number;
        public getLong(propName: string): number;
        public getLongWithDefault(propName: string, defaultValue: number): number;
        public getNullableFloat(propName: string): number;
        public getFloat(propName: string): number;
        public getFloatWithDefault(propName: string, defaultValue: number): number;
        public getNullableDate(propName: string): Date;
        public getDate(propName: string): Date;
        public getDateWithDefault(propName: string, defaultValue: Date): Date;
        public set(propName: string, value: any): void;
        public setTuplesArray(values: any[]): void;
        public setTuples(...values: any[]): void;
        public remove(propName: string): void;
        public removeAll(...propNames: string[]): void;
        public static merge(dest: DynamicMap, source: any, deep: boolean): DynamicMap;
        public static setDefaults(dest: DynamicMap, source: any): DynamicMap;
        public merge(source: any, deep: boolean): DynamicMap;
        public mergeDeep(source: any): DynamicMap;
        public setDefaults(defaults: any): DynamicMap;
        public assignTo(value: any): void;
        public pick(...propNames: string[]): DynamicMap;
        public omit(...propNames: string[]): DynamicMap;
        public toObject(): any;
        public toJSON(): any;
        public static fromValue(value: any): DynamicMap;
        public static fromTuples(...values: any[]): DynamicMap;
    }

	export class Converter {
        public static toNullableString(value: any): string;
        public static toString(value: any): string;
        public static toStringWithDefault(value: any, defaultValue: string): string;
        public static toNullableBoolean(value: any): boolean;
        public static toBoolean(value: any): boolean;
        public static toBooleanWithDefault(value: any, defaultValue?: boolean): boolean;
        public static toNullableInteger(value: any): number;
        public static toInteger(value: any): number;
        public static toIntegerWithDefault(value: any, defaultValue?: number): number;
        public static toNullableLong(value: any): number;
        public static toLong(value: any): number;
        public static toLongWithDefault(value: any, defaultValue?: number): number;
        public static toNullableFloat(value: any): number;
        public static toFloat(value: any): number;
        public static toFloatWithDefault(value: any, defaultValue?: number): number;
        public static toNullableDate(value: any): Date;
        public static toDate(value: any): Date;
        public static toDateWithDefault(value: any, defaultValue?: Date): Date;    
        public static toNullableArray(value: any): any[];
        public static toArray(value: any): any[];
        public static toArrayWithDefault(value: any, defaultValue: any[]): any[];
        public static listToArray(value: any): any[];
        public static fromMultiString(value: any, language?: string): string;
        public static toNullableMap(value: any): DynamicMap;
        public static toMap(value: any): DynamicMap;
        public static toMapWithDefault(value: any, defaultValue: DynamicMap): DynamicMap;
    }

    //*************** Config ***************

	export class Category {
		public static Undefined: string;
		public static Factories: string;
		public static Discovery: string;
		public static Config: string;
		public static Logs: string;
		public static Counters: string;
		public static Cache: string;
		public static Persistence: string;
		public static Clients: string;
		public static BusinessLogic: string;
		public static Controllers: string;
		public static Decorators: string;
		public static Services: string;
		public static Addons: string;
	}

	export class ComponentDescriptor {
		constructor(category: string, group: string, type: string, version: string);
		public getCategory(): string; 
		public getGroup(): string; 
		public getType(): string;
		public getVersion(): string;
		public match(descriptor: ComponentDescriptor): boolean;
		public toString(): string;
	}

	export class Endpoint {
		constructor(content?: DynamicMap);
		public getRawContent(): DynamicMap;
		public useDiscovery(): boolean;
		public getDiscoveryName(): string;
		public getProtocol(): string;
		public getHost(): string;
		public getPort(): number;
		public getUsername(): string;
		public getPassword(): string;
		public getUri(): string;
	}
	
	export class Connection {
		constructor(content?: DynamicMap);
		public getRawContent(): DynamicMap;
		public getType(): string;
		public getHost(): string;
		public getPort(): number;
		public getDatabase(): string;
		public getUsername(): string;
		public getPassword(): string;
		public getUri(): string;
	}

	export class ComponentConfig {
		constructor(category?: string, content?: DynamicMap);
		public getRawContent(): DynamicMap;
		public withDefaults(defaultContent: DynamicMap): ComponentConfig;
		public withDefaultTuples(...defaultTuples: any[]): ComponentConfig;
		public getDescriptor(): ComponentDescriptor;
		public getConnection(): Connection;
		public getConnections(): Connection[];
		public getEndpoint(): Endpoint;
		public getEndpoints(): Endpoint[];
		public getOptions(): DynamicMap;
		public static fromValue(value: any): ComponentConfig;
		public static fromTuples(...tuples: any[]): ComponentConfig;
	}

	export class MicroserviceConfig {
		constructor(content?: DynamicMap);
		public getRawContent(): DynamicMap;
		public getSection(category: string): ComponentConfig[];
		public removeSections(...categories: string[]): void;
		public static fromValue(value: any): MicroserviceConfig;
		public static fromTuples(...tuples: any[]): MicroserviceConfig;
	}

	export class ConfigReader {
		public static read(filePath: string): MicroserviceConfig;
		public static readJson(filePath: string): MicroserviceConfig;
		public static readJavascript(filePath: string): MicroserviceConfig;
		public static readYaml(filePath: string): MicroserviceConfig;
	}

    //*************** Data ***************

	export class IdGenerator {
        public static short(): string;
        public static short2(): string;
        public static uuid(): string;
    }

	export interface IIdentifiable {
		id: string;
	}

	export class FilterParams extends DynamicMap {
		constructor(map?: DynamicMap);
		public static fromValue(value: any): FilterParams;
		public static fromTuples(...tuples: any[]): FilterParams;
		public static fromMap(map: DynamicMap): FilterParams;
	}

	export class PagingParams {
        constructor(skip?: any, take?: any, total?: any);
        public skip: number;
        public take: number;
        public total: boolean;    
        public getSkip(minSkip: number): number;
        public getTake(maxTake: number): number;
        public toObject(): any;
        public toJSON(): any;
        public static fromValue(value: any): PagingParams;
        public static fromTuples(...tuples: any[]): PagingParams;
        public static fromMap(map: DynamicMap): PagingParams;
    }

	export class DataPage {
        constructor(data?: any, total?: number);
        public data: any[];
        public total: number;
        public toObject(): any;
        public toJSON(): any;
    }

	export class TagsProcessor {
        public static normalizeTag(tag: string);
        public static compressTag(tag: string);
        public static equalTags(tag1, tag2);
        public static normalizeTags(tags);
        public static compressTags(tags);
        public static extractHashTags(obj, searchFields);
    }
	
    //*************** Errors ***************

	export class ErrorCategory {
		public static UnknownError: string;
		public static BuildError: string;
		public static ConfigError: string;
		public static StateError: string;
		public static ConnectionError: string;
		public static CallError: string;
		public static FileError: string;
		public static BadRequest: string;
		public static Unauthorized: string;
		public static NotFound: string;
		public static Conflict: string;	
		public static Unsupported: string;
	}

	export class MicroserviceError extends Error {
        public category: string;
        public component: string;
        public code: string;
        public cause: any;
        public status: number;
        public details: any[];   
        public correlationId: string;         
        constructor(category?: string, component?: any, code?: string, message?: string);
        public forComponent(component: any): MicroserviceError;
        public withCode(code: string): MicroserviceError;
        public withCause(cause: any): MicroserviceError;
        public withStatus(status: number): MicroserviceError;
        public withDetails(...details: any[]): MicroserviceError;
        public withCorrelationId(correlationId: string): MicroserviceError;
        public toObject(): any;
        public toJSON(): any;
        public wrap(cause: any): MicroserviceError;
        public static wrap(error: MicroserviceError, cause: any): MicroserviceError;
        public static unwrap(error: any): any;
    }

	export class BadRequestError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class BuildError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class CallError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class ConfigError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class ConflictError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class ConnectionError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class UnknownError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class FileError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class NotFoundError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class StateError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class UnauthorizedError extends MicroserviceError {
		constructor(...args: any[]);
	}

	export class UnsupportedError extends MicroserviceError {
		constructor(...args: any[]);
	}

    //*************** Validation ***************

	export interface IPropertyValidationRule {
		validate(schema: PropertySchema, value: any): MicroserviceError[];
	}

	export interface IValidationRule {
		validate(schema: Schema, value: any): MicroserviceError[];
	}

	export class PropertySchema {
		constructor(name: string, array: boolean, typeOrSchema: any, optional?: boolean, rules?: IPropertyValidationRule[]);
		public getName(): string;
		public isArray(): boolean;
		public isOptional(): boolean;
		public getType(): string;
		public getSchema(): Schema;
		public getRules(): IPropertyValidationRule[];
	}

	export class Schema {
		constructor();
		public getProperties(): PropertySchema[];
		public getRules(): IValidationRule[];
		public withProperty(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema;
		public withArray(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema;
		public withOptionalProperty(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema;
		public withOptionalArray(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema;
		public withPropertySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema;
		public withArraySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema;
		public withOptionalPropertySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema;
		public withOptionalArraySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema;
		public withRule(rule: IValidationRule): Schema;
	}

    //*************** Commands ***************

	export interface ICommand {
		getName(): string;
		execute(correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void);
		validate(args: DynamicMap): MicroserviceError[];
	}

	export type CommandFunction = (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => void;
	export class Command implements ICommand {
		constructor(component: IComponent, name: string, schema: Schema, func: CommandFunction);
		public getName(): string;
		public execute(correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void;
		public validate(args: DynamicMap): MicroserviceError[];
	}

	export class CommandSet {
		constructor();
		public getCommands(): ICommand[];
		public findCommand(command: string): ICommand;
		public addCommand(command: ICommand): void;
		public addCommands(commands: ICommand[]): void;
		public addCommandSet(commands: CommandSet): void;
		public addIntercepter(intercepter: ICommandIntercepter): void;
		public execute(command: string, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void;
		public validate(command: string, args: DynamicMap): MicroserviceError[];
	}

	export interface ICommandIntercepter {
		getName(command: ICommand): string;
		execute(command: ICommand, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void;
		validate(command: ICommand, args: DynamicMap): MicroserviceError[];
	}

	export class InterceptedCommand implements ICommand {
		constructor(intercepter: ICommandIntercepter, next: ICommand);
		public getName(): string;
		public execute(correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void;
		public validate(args: DynamicMap): MicroserviceError[];
	}

	export class TimingIntercepter implements ICommandIntercepter {
		constructor(counters: ICounters, suffix: string);
		public getName(command: ICommand): string;
		public execute(command: ICommand, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void;
		public validate(command: ICommand, args: DynamicMap): MicroserviceError[];
	}

	export class TracingIntercepter implements ICommandIntercepter {
		constructor(loggers: ILogger[], verb: string);
		public getName(command: ICommand): string;
		public execute(command: ICommand, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void;
		public validate(command: ICommand, args: DynamicMap): MicroserviceError[];
	}

    //*************** Core ***************

	export enum State {
		Undefined,
		Initial,
		Configured,
		Linked,
		Opened,
		Ready,
		Closed
	}

	export interface IComponent {
		getDescriptor(): ComponentDescriptor;
		getState(): number;	
		configure(config: ComponentConfig): void;
		link(context: DynamicMap, components: ComponentSet): void;
		open(callback: (err: any) => void): void;
		close(callback: (err: any) => void): void;
	}

	export class ComponentSet implements ComponentSet {
		constructor(components?: IComponent[]);
		public add(component: IComponent): void;
		public addAll(components: IComponent[]): void;
		private addByCategory(components: IComponent[], category: string): IComponent[];
		public getAllByCategory(category: string): IComponent[];
		public getAllUnordered(): IComponent[];
		public getAllOrdered(): IComponent[];
		public getAllOptional(descriptor: ComponentDescriptor): IComponent[];
		public getOneOptional(descriptor: ComponentDescriptor): IComponent;
		public getAllRequired(descriptor: ComponentDescriptor): IComponent[];
		public getOneRequired(descriptor: ComponentDescriptor): IComponent;
		public getOnePrior(component: IComponent, descriptor: ComponentDescriptor): IComponent;
		public static fromComponents(...components: IComponent[]): ComponentSet;
	}


	export interface IComponentFactory {
		extend(...baseFactories: IComponentFactory[]): void;
		register(descriptor: ComponentDescriptor, classFactory: any): IComponentFactory;
		find(descriptor: ComponentDescriptor): () => void;
		create(descriptor: ComponentDescriptor): IComponent;
	}

	export abstract class AbstractComponent implements IComponent {
		protected _descriptor: ComponentDescriptor;
		protected _state: number;
		protected _config: ComponentConfig;
		protected _discovery: IDiscovery;
		protected _loggers: ILogger[];
		protected _counters: ICounters;
		constructor(descriptor: ComponentDescriptor);
		public getDescriptor(): ComponentDescriptor; 
		public getState(): number; 
		protected checkCurrentState(state: number): void;
		protected checkNewStateAllowed(newState: number): void;
		public configure(config: ComponentConfig): void;
		public skipConfigure(): void;
		public link(context: DynamicMap, components: ComponentSet): void;
		public skipLink(): void;
		public open(callback: (err: any) => void): void;
		public close(callback: (err: any) => void): void; 
		protected writeLog(level: number, correlationId: string, message: any[]);
		public fatal(correlationId: string, ...message: any[]): void; 
		public error(correlationId: string, ...message: any[]): void; 
		public warn(correlationId: string, ...message: any[]): void; 
		public info(correlationId: string, ...message: any[]): void; 
		public debug(correlationId: string, ...message: any[]): void; 
		public trace(correlationId: string, ...message: any[]): void; 
		protected beginTiming(name: string): ITiming;
		protected stats(name: string, value: number): void; 
		protected last(name: string, value: number): void;
		protected timestampNow(name: string): void;
		protected timestamp(name: string, value: Date): void;
		protected incrementOne(name: string): void;
		protected increment(name: string, value: number): void;
		public toString(): string;
	}

	export interface IDiscovery extends IComponent {
		register(endpoint: Endpoint, callback: (err: any) => void);
		resolve(endpoints: Endpoint[], callback: (err: any, endpoint: Endpoint) => void);
		resolveAll(endpoints: Endpoint[], callback: (err: any, endpoints: Endpoint[]) => void);
	}

    export enum LogLevel {
        None,
        Fatal,
        Error,
        Warn,
        Info,
        Debug,
        Trace
    }

    export interface ILogger extends IComponent {
        getLevel(): number;
        log(level: number, component: string, correlationId: string, message: any[]): void;
    }

	export interface ITiming {
		endTiming();
	}

	export interface ICounters extends IComponent {
		beginTiming(name: string): ITiming;
		stats(name: string, value: number): void;
		last(name: string, value: number): void;
		timestampNow(name: string): void;
		timestamp(name: string, value: Date): void;
		incrementOne(name: string): void;
		increment(name: string, value: number): void;
	}

	export interface ICache extends IComponent {
		retrieve(key: string, callback: (err: any, value: any) => void): void;
		store(key: string, value: any, callback: (err: any, value: any) => void): void;
		remove(key: string, callback: (err: any) => void): void;
	}

	export interface IBootConfig extends IComponent {
		readConfig(callback: (err: any, config: MicroserviceConfig) => void): void;
	}

	export interface IPersistence extends IComponent {
	}

	export interface IClient extends IComponent {
	}

	export interface IBusinessLogic extends IComponent {
		getCommands(): ICommand[];
		findCommand(command: string): ICommand;
		execute(command: string, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void);
		validate(command: string, args: DynamicMap): MicroserviceError[];
	}

	export interface IController extends IBusinessLogic {
	}

	export interface IDecorator extends IBusinessLogic {
    }

	export interface IService extends IComponent {
	}

	export interface IAddon extends IComponent {
	}

    //*************** Addons ***************

    export abstract class AbstractAddon extends AbstractComponent implements IAddon {    
        constructor(descriptor: ComponentDescriptor);
    }

	export class SenecaAddon extends AbstractAddon {    
		public static Descriptor: ComponentDescriptor;
		constructor();
		public getSeneca(): any;
		public setSeneca(seneca: any): void;
	}

    //*************** Cache ***************

	export abstract class AbstractCache extends AbstractComponent implements ICache {    
		constructor(descriptor: ComponentDescriptor);
		public abstract retrieve(key: string, callback: (err: any, value: any) => void): void;
		public abstract store(key: string, value: any, callback: (err: any, value: any) => void): void;
		public abstract remove(key: string, callback: (err: any) => void): void;
	}

	export class CacheEntry {
		constructor(key: string, value: any);
		public getKey(): string; 
		public getValue(): any;
		public setValue(value: any): void;
		public getCreated(): number;
	}

	export class MemcachedCache extends AbstractCache {
        public static Descriptor: ComponentDescriptor;
        constructor();
        public configure(config: ComponentConfig);
        public open(callback: (err: any) => void): void;
        public close(callback: (err: any) => void): void;
        public retrieve(key: string, callback: (err: any, value: any) => void): void;
        public store(key: string, value: any, callback: (err: any, value: any) => void): void;
        public remove(key: string, callback: (err: any) => void): void;
    }

	export class MemoryCache extends AbstractCache {
        public static Descriptor: ComponentDescriptor;
        constructor();
        public configure(config: ComponentConfig);
        public retrieve(key: string, callback: (err: any, value: any) => void): void;
        public store(key: string, value: any, callback: (err: any, value: any) => void): void;
        public remove(key: string, callback: (err: any) => void): void;
    }

	export class NullCache extends AbstractCache {
		public static Descriptor: ComponentDescriptor;
		constructor();
		public retrieve(key: string, callback: (err: any, value: any) => void): void;
		public store(key: string, value: any, callback: (err: any, value: any) => void): void;
		public remove(key: string, callback: (err: any) => void): void;
	}

    //*************** Boot ***************

    export abstract class AbstractBootConfig extends AbstractComponent implements IBootConfig {    
        constructor(descriptor: ComponentDescriptor);
        public abstract readConfig(callback: (err: any, config: MicroserviceConfig) => void): void;
    }

    export class FileBootConfig extends AbstractBootConfig {
        public static Descriptor: ComponentDescriptor;
        constructor();
        public configure(config: ComponentConfig): void;
        public open(callback: (err: any) => void): void;
        public readConfig(callback: (err: any, config: MicroserviceConfig) => void): void;
    }

    //*************** Discovery ***************

	export abstract class AbstractDiscovery extends AbstractComponent implements IDiscovery {    
		constructor(descriptor: ComponentDescriptor);
		public abstract register(endpoint: Endpoint, callback: (err: any) => void);
		public abstract resolve(endpoints: Endpoint[], callback: (err: any, endpoint: Endpoint) => void);
		public abstract resolveAll(endpoints: Endpoint[], callback: (err: any, endpoints: Endpoint[]) => void);
	}

    //*************** Counters ***************

	export enum CounterType {
		Interval,
		LastValue,
		Statistics,
		Timestamp,
		Increment
	}

	export class Counter {
		constructor(name?: string, type?: CounterType);
		public name: string;
		public type: CounterType;
		public last: number;
		public count: number;
		public min: number;
		public max: number;
		public avg: number;    
		public time: Date;
	}

	export abstract class AbstractCounters extends AbstractComponent implements ICounters {
		constructor(descriptor: ComponentDescriptor);
		public configure(config: ComponentConfig);
		public open(callback: (err: any) => void): void;
		public close(callback: (err: any) => void): void;
		protected abstract save(counters: Counter[], callback: (err: any) => void): void;
		public reset(name: string): void;
		public resetAll(): void;
		public dump(): void;
		public getAll(): Counter[];
		public get(name: string, type: CounterType): Counter;
		public setTiming(name: string, elapsed: number): void;
		public beginTiming(name: string): ITiming;
		public stats(name: string, value: number): void;
		public last(name: string, value: number): void;
		public timestampNow(name: string): void;
		public timestamp(name: string, value: Date): void;
		public incrementOne(name: string): void;
		public increment(name: string, value: number): void;
	}

	export class NullCounters extends AbstractComponent implements ICounters {
		public static Descriptor: ComponentDescriptor;
		constructor();
		public beginTiming(name: string): ITiming;
		public stats(name: string, value: number);    
		public last(name: string, value: number);    
		public timestampNow(name: string);
		public timestamp(name: string, value: Date);
		public incrementOne(name: string);
		public increment(name: string, value: number);
	}

    export class LogCounters extends AbstractCounters {
        public static Descriptor: ComponentDescriptor;
        constructor();
        protected save(counters: Counter[], callback: (err: any) => void);
    }

    export class Timing implements ITiming {
        constructor(counters: AbstractCounters, name: string);
        public endTiming(): void;
    }

    //*************** Logger ***************

	export abstract class AbstractLogger extends AbstractComponent implements ILogger {
        protected _level: number;
        constructor(descriptor: ComponentDescriptor);
        public configure(config: ComponentConfig);
        public getLevel(): number;
        public abstract log(level: number, component: string, correlationId: string, message: any[]): void;
    }

    export class NullLogger extends AbstractLogger {
        public static Descriptor: ComponentDescriptor;
        constructor();
        public log(level: number, component: string, correlationId: string, message: any[]): void;
    }

    export class LogEntry {
        public component: string;
        public time: Date;
        public level: number;
        public correlationId: string;
        public message: any[];
        constructor(level: number, component: string, time: Date, correlationId: string, message: any[]);
    }

	export abstract class CachedLogger extends AbstractLogger {
		constructor(descriptor: ComponentDescriptor);
		public configure(config: ComponentConfig);
		public open(callback: (err: any) => void): void;        
		public close(callback: (err: any) => void): void; 
		public log(level: number, component: string, correlationId: string, message: any[]): void;
		protected abstract save(entries: LogEntry[], callback): void;
	}
	
	export class ConsoleLogger extends AbstractLogger {
		public static Descriptor: ComponentDescriptor;
		constructor();
		public log(level: number, component: string, correlationId: string, message: any[]): void;
	}

	export class LogFormatter {
		public static formatLevel(level: number): string;
		public static formatMessage(message: any[]): string;
		public static format(level: number, message: any[]): string;
	}

    //*************** Persistence ***************

	export abstract class AbstractPersistence extends AbstractComponent implements IPersistence {
		constructor(descriptor: ComponentDescriptor);
		protected createUuid(): string;
		public clearTestData(callback: (err: any) => void): void;
	}

	export abstract class FilePersistence extends AbstractPersistence {
        protected _path: any;
        protected _initialData: any;
        protected _maxPageSize: number;
        protected _items: any[];
        protected _converter: any;
        protected _listConverter: any;    
        constructor(descriptor: ComponentDescriptor)
        public configure(config: ComponentConfig);
        public open(callback: (err: any) => void): void;
        public close(callback: (err: any) => void): void;
        public load(callback: (err: any) => void): void;
        public save(callback: (err: any) => void): void;
        public clearTestData(callback: (err: any) => void): void;
        protected getPage(correlationId: string, filter: any, paging: PagingParams, sort: any, select: any, callback: any): void;
        protected getList(correlationId: string, filter: any, sort: any, select: any, callback: any): void;
        protected getRandom(correlationId: string, filter: any, callback: any): void;
        protected getById(correlationId: string, id: any, callback: any): void;
        protected create(correlationId: string, item: any, callback: any): void;
        protected update(correlationId: string, id: any, newItem: any, callback: any): void;
        protected delete(correlationId: string, id: any, callback: any): void;
        protected convertItem(item: any): any;
        protected convertListItem(item: any): any;
    }

	export abstract class MemoryPersistence extends FilePersistence {
		constructor(descriptor: ComponentDescriptor);
		public configure(config: ComponentConfig): void;
		public save(callback: (err: any) => void): void;
	}

	export abstract class MongoDbPersistence extends AbstractPersistence {
		protected _connection: any;
		protected _maxPageSize: number;
		protected _model: any;
		protected _converter: any;
		protected _listConverter: any;    
		constructor(descriptor: ComponentDescriptor, model: any);
		public configure(config: ComponentConfig);
		public link(context: DynamicMap, components: ComponentSet);
		public open(callback: (err: any) => void): void;
		public close(callback: (err: any) => void): void;
		public clearTestData(callback: (err: any) => void): void;
		protected getPage(correlationId: string, filter: FilterParams, paging: PagingParams, sort: any, select: any, callback: any): void;                               
		protected getList(correlationId: string, filter: any, sort: any, select: any, callback): void;
		protected getRandom(correlationId: string, filter: any, callback: any): void;
		protected getById(correlationId: string, id: string, callback: any): void;
		protected create(correlationId: string, item: any, callback: any): void;
		protected update(correlationId: string, id: string, newItem: any, callback: any): void;
		protected delete(correlationId: string, id: string, callback: any): void;
		protected jsonToPublic(value: any): any;
		protected convertItem(value: any): any;
		protected convertListItem(value: any): any;
	}

    //*************** Logic ***************

	export class AbstractBusinessLogic extends AbstractComponent implements IBusinessLogic {
		constructor(descriptor: ComponentDescriptor);
		public getCommands(): ICommand[];
		public findCommand(command: string): ICommand;
		protected addCommand(command: ICommand): void;
		protected addCommandSet(commands: CommandSet): void;
		protected delegateCommands(component: IBusinessLogic): void;
		protected addIntercepter(intercepter: ICommandIntercepter): void;
		public execute(command: string, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void);
		public validate(command: string, args: DynamicMap): MicroserviceError[];
	}

	export abstract class AbstractController extends AbstractBusinessLogic implements IController {
		constructor(descriptor: ComponentDescriptor);
		public link(context: DynamicMap, components: ComponentSet): void;
		protected instrument(correlationId: string, name: string, callback: any);
	}

	export abstract class AbstractDecorator extends AbstractBusinessLogic implements IDecorator {
		constructor(descriptor: ComponentDescriptor);
	}

    //*************** Clients ***************

	export abstract class AbstractClient extends AbstractComponent implements IClient {
		constructor(descriptor: ComponentDescriptor);
		protected instrument(correlationId: string, name: string, callback: any);
	}

	export abstract class DirectClient extends AbstractClient {
		constructor(descriptor: ComponentDescriptor);
	}

	export abstract class RestClient extends AbstractClient {
		protected _rest;
		constructor(descriptor: ComponentDescriptor);
		public configure(config: ComponentConfig): void;
		public open(callback: (err: any) => void): void;
		public close(callback: (err: any) => void): void;
		protected addCorrelationId(params: any, correlationId: string): any;
		protected addFilterParams(params: any, filter: any): void;
		protected addPagingParams(params: any, paging: any): void;
		protected call(method: string, route: string, correlationId?: string, params?: any, data?: any, callback?: (err: any, result: any) => void): void;   
	}

	export abstract class SenecaClient extends AbstractClient {
        protected _seneca: any;    
        constructor(descriptor: ComponentDescriptor);
        public link(context: DynamicMap, components: ComponentSet): void;       
        public open(callback: (err: any) => void): void;
        public close(callback: (err: any) => void): void;
        protected call(role: string, cmd: string, correlationId?: string, params?: any, callback?: (err: any, result: any) => void): void;
    }

	export abstract class LambdaClient extends AbstractClient {
		constructor(descriptor: ComponentDescriptor);
		public configure(config: ComponentConfig): void;
		public link(context: DynamicMap, components: ComponentSet): void;
		protected invoke(invocationType: string, cmd: string, args: any, callback: (err: any, result: any) => void): void;
		protected call(cmd: string, correlationId?: string, params?: any, callback?: (err: any, result: any) => void): void;
		protected callOneWay(cmd: string, correlationId?: string, params?: any, callback?: (err: any, result: any) => void): void;
	}

    //*************** Servers ***************

	export abstract class AbstractService extends AbstractComponent implements IService {
		constructor(descriptor: ComponentDescriptor);
	}

	export abstract class RestService extends AbstractService {
        protected _server: any;
        constructor(descriptor: ComponentDescriptor);
        public configure(config: ComponentConfig);
        public link(context: DynamicMap, components: ComponentSet): void;                               
        public open(callback: (err: any) => void): void;
        public close(callback: (err: any) => void): void;
        protected sendResult(req, res): any;
        protected sendCreatedResult(req, res): any;
        protected sendDeletedResult(req, res): any;
        protected sendError(req, res, error): any;
        protected registerRoute(method: string, route: string, handler: any, intercept?: any): void;
        protected register(): void;
    }

	export abstract class SenecaService extends AbstractService {
		protected _seneca: any;    
		constructor(descriptor: ComponentDescriptor);
		public link(context: DynamicMap, components: ComponentSet): void;
		public open(callback: (err: any) => void): void;
		public close(callback: (err: any) => void): void;
		protected registerAction(role: string, cmd: string, pattern: any, action: (params: any, callback: (err: any, result: any) => void) => void): void;
		protected registerCommands(role: string, commands: ICommand[]): void;
		protected registerCommandSet(role: string, commands: CommandSet): void;
		protected register(): void;
	}

	export class RequestAuth {
		public static anybody(req, res, next);
		public static user(req, res, next);
		public static owner(req, res, next);
	}

	export class RequestDetector {
        public static detectPlatform(req);
        public static detectBrowser(req);
        public static detectAddress(req);
        public static detectServerHost(req);
        public static detectServerPort(req);
    }

    export class ResponseSender {
        public static sendError(req: any, res: any, error: any): void;
        public static sendResult(req: any, res: any): (err: any, result: any) => void;
        public static sendCreatedResult(req: any, res: any): (err: any, result: any) => void;
        public static sendDeletedResult(req: any, res: any): (err: any, result: any) => void;
    }

    //*************** Build ***************

	export class FactoryRegistration {
		constructor(descriptor: ComponentDescriptor, classFactory: () => void);
		public getDescriptor(): ComponentDescriptor;
		public getClassFactory(): () => void;
	}

	export class ComponentFactory implements IComponentFactory {
		protected _registrations: FactoryRegistration[];
		protected _baseFactories: IComponentFactory[];
		constructor(...baseFactories: IComponentFactory[]);
		public extend(...baseFactories: IComponentFactory[]): void;
		public register(descriptor: ComponentDescriptor, classFactory: any): IComponentFactory;
		public find(descriptor: ComponentDescriptor): () => void;
		public create(descriptor: ComponentDescriptor): IComponent;
		public static createFactory(config: DynamicMap): IComponentFactory;
	}

	export class DefaultFactory extends ComponentFactory {
		public static Instance: DefaultFactory;
		constructor();
	}

	export class Builder {
		public static buildSection(factory: IComponentFactory, config: MicroserviceConfig, category: string): IComponent[];	
		public static buildGlobals(factory: IComponentFactory, config: MicroserviceConfig, components: ComponentSet): IComponent[];
		public static build(factory: IComponentFactory, config: MicroserviceConfig): ComponentSet;
	}

    //*************** Run ***************
	
	export class LifeCycleManager {
        public static getState(components: IComponent[]): number;
        public static linkComponents(context: DynamicMap, components: IComponent[], callback?: (err: any) => void): void;
        public static link(context: DynamicMap, components: ComponentSet, callback?: (err: any) => void): void;
        public static linkAndOpenComponents(context: DynamicMap, components: IComponent[], callback: (err: any) => void): void;
        public static linkAndOpen(context: DynamicMap, components: ComponentSet, callback: (err: any) => void): void;
        public static openComponents(components: IComponent[], callback: (err: any) => void): void;
        public static open(components: ComponentSet, callback: (err: any) => void): void;
        public static closeComponents(components: IComponent[], callback: (err: any) => void): void;
        public static close(components: ComponentSet, callback: (err: any) => void): void;
        public static forceCloseComponents(components: IComponent[], callback: (err: any) => void): void;
        public static forceClose(components: ComponentSet, callback: (err: any) => void): void;
    }

	export class Microservice {
        constructor(name: string, factory: IComponentFactory);
        public getName(): string;
        public enableExitOnError(): void;
        public getConfig(): MicroserviceConfig;
        public setConfig(config: MicroserviceConfig): void;
        public loadConfig(configPath: string): void;
        public getComponents(): ComponentSet;
        public fatal(...message: any[]): void;
        public error(...message: any[]): void;
        public info(...message: any[]): void;
        public trace(...message: any[]): void;
        public build(callback: (err: any) => void): void;
        public link(context: DynamicMap, callback: (err: any) => void): void;
        public open(callback: (err: any) => void): void;
        public start(callback?: (err: any) => void): void;
        public startWithConfig(config: MicroserviceConfig, callback?: (err: any) => void): void;
        public startWithConfigFile(configPath: string, callback?: (err: any) => void): void;
        public close(callback: (err: any) => void): void;
        public exit(err: any, callback?: (err: any) => void): void;
    }

	export class ProcessRunner {
        constructor(microservice: Microservice);
        public setConfig(config: any): void;
        public loadConfig(configPath: string): void;
        public loadConfigWithDefault(defaultConfigPath: string): void;
        public start(callback?: (err: any) => void): void;
        public startWithConfig(config: any, callback?: (err: any) => void): void;
        public startWithConfigFile(configPath: string, callback?: (err: any) => void): void;
        public startWithDefaultConfig(defaultConfigPath: string, callback?: (err: any) => void): void;
        public stop(callback?: (err: any) => void): void;
    }

	export class SenecaPlugin {
		constructor(name: string, microservice: Microservice);
		public entry(config?: any): any;
	}	

	export abstract class LambdaFunction {
        constructor(microservice: Microservice);
        public setConfig(config: MicroserviceConfig): void;
        public loadConfig(configPath: string): void;
        public loadConfigWithDefault(defaultConfigPath: string): void;
        public link(context: DynamicMap, components: ComponentSet): void;
        protected registerAction(cmd: string, action: (params: any, callback: (err: any, result: any) => void) => void): void;
        protected registerCommands(commands: ICommand[]): void;
        protected registerCommandSet(commands: CommandSet): void;
        protected register(): void;
        public getHandler(): (event: any, context: any) => void;
        public start(callback?: (err: any) => void): void;
        public startWithConfig(config: MicroserviceConfig, callback?: (err: any) => void): void;
        public startWithConfigFile(configPath: string, callback?: (err: any) => void): void;
        public startWithDefaultConfig(defaultConfigPath: string, callback?: (err: any) => void): void;
        public stop(callback?: (err: any) => void): void;
    }
	
}

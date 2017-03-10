Welcome to the Pip.Services Runtime for Node.js API docs page. These pages contain the reference materials 
for the version 0.0.

The documentation is organized by classes and interfaces. They are groupped into packages below:

## Core

Contains interfaces for microservice components and other key abstractions.

- [IComponent](interfaces/icomponent.html) - microservice component interface with component lifecycle definition
- [ComponentSet](classes/componentset.html) - set of microservice components with search capabilities
- [IComponentFactory](interfaces/icomponentfactory.html) - factory interface to find and instantiate components
- [State](enums/state.html) - component lifecycle states
- [AbstractComponent](classes/abstractcomponent.html) - abstract class for all microservice components
- [IDiscovery](interfaces/idiscovery.html) - interface for service discovery components
- [IConfigReader](interfaces/iconfigreader.html) - interface for configuration readers
- [ILogger](interfaces/ilogger.html) - interface for microservice loggers
- [LogLevel](enums/loglevel.html) - enumeration for logging levels
- [ICounters](interfaces/icounters.html) - interface for performance counters
- [ITiming](interfaces/itiming.html) - interface to complete elapsed time measurement
- [ICache](interfaces/icache.html) - interface for transient cache
- [IPersistence](interfaces/ipersistence.html) - interface for persistence (data access) components
- [IBusinessLogic](interfaces/ibusinesslogic.html) - interface for business logic components (controllers and decorators)
- [IController](interfaces/icontroller.html) - interface for business logic controller
- [IInterceptor](interfaces/iinterceptor.html) - interface for interceptors that decorate controller and customize microservice behavior
- [IClient](interfaces/iclient.html) - interface for clients connectors to other microservices
- [IService](interfaces/iservice.html) - interface for API service (endpoint) that microservice exposes to its clients
- [IAddon](interfaces/iaddon.html) - interface for microservice extentions 
 
## Config

Microservice configuration package

- [Category](classes/category.html) - category of components or configuration sections that are used to configure components
- [MicroserviceConfig](classes/microserviceconfig.html) - microservice configuration
- [ComponentConfig](classes/componentconfig.html) - component configuration section
- [ComponentDescriptor](classes/componentdescriptor.html) - component descriptor / identifier
- [Endpoint](classes/endpoint.html) - service or client endpoint (address) configuration 
- [Connection](classes/connection.html) - database connection configuration 

## Build

Microservice construction and lifecycle management

- [ComponentFactory](classes/componentfactory.html) - factory to locate and instantiate components by component descriptors
- [FactoryRegistration](classes/factoryregistration.html) - registration of components in component factory
- [DefaultFactory](classes/defaultfactory.html) - factory to create default runtime components
- [Builder](classes/builder.html) - microservice builder that creates components following configuration as a build recipe

## Run

Microservice execution wrappers for various deployment platforms

- [LifeCycleManager](classes/lifecyclemanager.html) - component lifecycle manager that inits, opens and closes a set of components
- [Microservice](classes/microservice.html) - microservice instance
- [ProcessRunner](classes/processrunner.html) - runs microservices as a system process. It if also used for windows services, linux deamons or in docker deployments
- [SenecaPlugin](classes/senecaplugin.html) - plugin for seneca microservice framework http://senecajs.org
- [LambdaFunction](classes/lambdafunction.html) - wrapper for AWS lambda function http://aws.amazon.com/lambda

## Discovery

Discovery components implementations. They used to register service addresses and dynamically 
resolve them for clients. 

- [AbstractDiscovery](classes/discovery.html) - abstract class for all discovery components

## Boot

Bootstrap configuration readers. They used to define types of microservice components and
initialize their execution settings.

- [AbstractBootConfig](classes/abstractbootconfig.html) - abstract class for all config reader components
- [FileBootConfig](classes/filebootconfig.html) - reads microservice configuration from JSON file on disk 

## Logs

Logging components implementation. They used to report about microservice errors or log transactions
performance by microservice.

- [AbstractLogger](classes/abstractlogger.html) - abstract class for all logging components
- [NullLogger](classes/nulllogger.html) - NULL logger that doesn't do anything
- [ConsoleLogger](classes/consolelogger.html) - logger that outputs messages to standard output and error streams
- [CachedLogger](classes/cachedlogger.html) - abstract logger that caches messages for batch output
- [LogEntry](classes/logentry.html) - individual log entry used by CachedLogger

## Counters

Performance counting components implementations. They used to monitor microservice performance by measuring
time intervals, counting calls, recording timestamps of key events or arbitrary values.

- [AbstractCounter](classes/abstractcounter.html) - abstract class for all performance counters
- [NullCounter](classes/nullcounter.html) - NULL performance counter that doesn't do anything
- [LogCounter](classes/logcounter.html) - performance counter that periodically dumps counters to log output
- [Counter](classes/counter.html) - performance counter
- [CounterType](enums/countertype.html) - enumeration for performance counter types
- [Timing](classes/timing.html) - callback class to complete elapsed time measurement

## Cache

Caching components implementations. They used to store frequently accessed data in transient cache 
to avoid roundtrips to persistent storage for better performance.

- [AbstractCache](classes/abstractcache.html) - abstract class for all caching components
- [NullCache](classes/nullcache.html) - NULL cache that doesn't do anything
- [MemoryCache](classes/memorycache.html) - local in-memory cache to be used for testing
- [CacheEntry](classes/cacheentry.html) - cache value entry used by MemoryCache
- [MemcachedCache](classes/memcached.html) - connector to memcached distributed caching service https://memcached.org

## Persistence

Persistence components implementations. They read/write data to a database or another storage.

- [AbstractDataAccess](classes/abstractdataaccess.html) - abstract class for all data access components
- [MemoryDataAccess](classes/memorydataaccess.html) - in-memory data access to be used for testing
- [FileDataAccess](classes/filedataaccess.html) - file data access that reads and writes data from/to JSON file on disk
- [MondoDbDataAccess](classes/mongodbdataaccess.html) - data access for MongoDB NoSQL database https://www.mongodb.com

## Logic

Business logic controllers implementations. They encapsulate microservice business logic

- [AbstractBusinessLogic](classes/abstractbusinesslogic.html) - abstract class for all controllers and decorators
- [AbstractController](classes/abstractcontroller.html) - abstract class for microservice controllers
- [AbstractDecorator](classes/abstractdecorator.html) - abstract class for all controller decorators

## Clients

Client dependency components implementations. They provide user-friendly connectors to microservice API endpoints.

- [AbstractClient](classes/abstractclass.html) - abstract class for all client dependencies
- [DirectClient](classes/directclass.html) - client to make direct in-process calls to business logic within the same microservice container
- [RestClient](classes/restclient.html) - interoperable HTTP/REST client
- [LambdaClient](classes/lambdaclient.html) - client to microservices deployed as AWS lambda functions http://aws.amazon.com/lambda
- [SenecaClient](classes/senecaclient.html) - client to microservice API endpoints via Seneca transports http://senecajs.org

## Services

Service components implementations. They expose API endpoints to accept calls from microservice clients.

- [AbstractService](classes/abstractservice.html) - abstract class for all API services
- [RestService](classes/restservice.html) - interoperable HTTP/REST service
- [SenecaService](classes/senecaservice.html) - service endpoint accessed via Seneca transports http://senecajs.org
- [RequestDetector](classes/requestdetector.html) - detects client OS, browser and IP
- [RequestAuth](classes/requestauth.html) - performs authorization of incoming requests
- [ResponseSender](classes/responsesender.html) - sends proper HTTP responses with results and errors   

## Addons

Addon components implementations. They represent microservice extensions that take no part in business transactions, 
but provide additional services like reporting microservice health state, collecting usage metrics or performing 
random shutdowns for relience testing.

- [AbstractAddon](classes/abstractaddon.html) - abstract class for all addons   
- [SenecaAddon](classes/senecaaddon.html) - addon that allows to control and share seneca instance across all components   

## Errors

Definition of error types which are thrown and processed by microservices.

- [ErroCategory](classes/errorcategory.html) - broad categories for microservice errors
- [MicroserviceError](classes/microserviceerror.html) - base class for all microservice errors
- [UnknownError](classes/unknownerror.html) - internal or unknown error which shall not happen in well written code
- [BuildError](classes/builderror.html) - error occured during microservice build process
- [ConfigError](classes/configerror.html) - error in user-defined microservice configuration
- [StateError](classes/stateerror.html) - error caused by calling operations out of order
- [ConnectionError](classes/connectionerror.html) - error happend during connect or disconnect to external service
- [CallError](classes/callerror.html) - unrecornized errors returned by external services
- [FileError](classes/fileerror.html) - errors happend in local file operations
- [BadRequestError](classes/badrequesterror.html) - error caused by a client submitted wrong operation parameters
- [NotFoundError](classes/notfounderror.html) - error caused by attempt to access object that doesn't exist
- [ConflictError](classes/conflicterror.html) - errors cause by version conflict in concurrent operations
- [UnauthorizedError](classes/unauthorizederror.html) - error due to absence of user credentials or insufficient access rights
- [UnsupportedError](classes/unsupportederror.html) - unsupported or unimplemented errors

## Data

Utility classes to support specific data processing patterns

- [IIdentifiable](interfaces/iidentifiable.html) - interface for data objects identified by string **id**s
- [FilterParams](classes/filterparams.html) - free-form query parameters
- [PageParams](classes/pageparams.html) - query paging parameters
- [DataPage](classes/datapage.html) - envelop object to return paged query result
- [IdGenerator](classes/idgenerator.html) - generator of unique object ids
- [TagsProcessor](classes/tagsprocessor.html) - extracts from data objects and processes search tags

## Validation

Data validation schemas

- [Schema](classes/schema.html) - validation schema for data objects 
- [IValidationRule](interfaces/ivalidationrule.html) - interface for schema validation rules
- [PropertySchema](classes/propertyschema.html) - validation schema for specific object properties 
- [IPropertyValidationRule](interfaces/ipropertyvalidationrule.html) - interface for property validation rules

## Commands

Implementation of command pattern for business operations. It allowes to easily intercept, delegate and override 
operations in chain of component calls that interact to fulfil business requests

- [ICommand](interfaces/icommand.html) - command interface to implement command pattern for business operations
- [Command](classes/command.html) - command to wrap a business method
- [ICommandInterceptor](interfaces/icommandinterceptoer.html) - interceptor to intercept calls to multiple commands
- [InterceptedCommand](classes/interceptedcommand.html) - command to inject inceptors in command call chain
- [CommandSet](classes/commandset.html) - command set that handles command requests
- [TimingIntercepter](classes/timingintercepter.html) - intercepter to track commands execution time
- [TracingIntercepter](classes/tracingintercepter.html) - intercepter to log trace messages for executed commands

## Portability

Package containing cross-language and cross-platform abstractions and utility functions.

- [DynamicMap](classes/dynamicmap.html) - language-independent hashmap to store hierarchical dynamic data
- [Converter](classes/converter.html) - value type converter to convert objects to strings, numbers, dates and maps

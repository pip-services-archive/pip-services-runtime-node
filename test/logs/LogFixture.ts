let assert = require('chai').assert;

import { LogLevel } from '../../src/LogLevel';
import { ILogger } from '../../src/ILogger';

export class LogFixture {
    private _logger: ILogger;
    
    constructor(logger: ILogger) {
        assert.isNotNull(logger);
        this._logger = logger;
    }
    
    testLogLevel() {
        assert.isDefined(this._logger.getLevel);
    }
    
    testTextOutput() {
        this._logger.log(LogLevel.Fatal, 'ABC', '12345678', ['Fatal error...']);
        this._logger.log(LogLevel.Error, 'ABC', '12345678', ['Recoverable error...']);
        this._logger.log(LogLevel.Warn, 'ABC', '12345678', ['Warning...']);
        this._logger.log(LogLevel.Info, 'ABC', '12345678', ['Information message...']);
        this._logger.log(LogLevel.Debug, 'ABC', '12345678', ['Debug message...']);
        this._logger.log(LogLevel.Trace, 'ABC', '12345678', ['Detail debug message...']);
    }

    testMixedOutput() {
        this._logger.log(LogLevel.Fatal, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel.Error, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel.Warn, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel.Info, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel.Debug, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel.Trace, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
    }
}

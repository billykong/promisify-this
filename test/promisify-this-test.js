var assert = require('assert');
var promisifyThis = require('../promisify-this.js')

describe('#promisifyThis()', function() {
  let caller;
  beforeEach(function() {
    caller = {};
    caller.func = function (arg1, callback) { callback (this) };
  });

  it('should keep the caller as "this" when the function is executed', async function() {
    const thisInsideFunc = await promisifyThis(caller.func, caller)('someArg');
    assert.equal(caller, thisInsideFunc);
  });

  it('should allow function to access attributes of caller through this', async function() {
    caller.prop = 'important attr in caller';
    caller.func = function (arg1, callback) { callback (this.prop) };
    const callerProp = await promisifyThis(caller.func, caller)('someArg');
    assert.equal('important attr in caller', callerProp);
  });

  it('should not mistake 0 as falsy value', async function() {
    caller.prop = 0;
    caller.func = function (arg1, callback) { callback (this.prop) };
    const callerProp = await promisifyThis(caller.func, caller)('someArg');
    assert.equal(0, callerProp);
  });

  it('should (err, data) style in callback', async function () {
    caller.prop = 'important attr in caller';
    caller.func = function (arg1, callback) { callback (null, this.prop) };
    const callerProp = await promisifyThis(caller.func, caller)('someArg');
    assert.equal('important attr in caller', callerProp);
  });

  it('should allow no caller binding', async function () {
    caller.func = function (arg1, callback) { callback (arg1) };
    const someArg = await promisifyThis(caller.func, caller)('someArg');
    assert.equal('someArg', someArg);
  });

  it('should allow binding other object as caller', async function () {
    const caller2 = { key: 'another object' };
    const thisInsideFunc = await promisifyThis(caller.func, caller2)('someArg');
    assert.equal(caller2, thisInsideFunc);
  });

  it('should allow custom callback handler', async function () {
    const cbHandler = function (resolve, reject, arg1, ctx) {
      resolve('special handling');
    }
    caller.func = function (arg1, callback) { callback (arg1, this) };
    const result = await promisifyThis(caller.func, caller, cbHandler)('someArg');
    assert.equal('special handling', result);
  });
  
});

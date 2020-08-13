module.exports = (func, caller, cbHandler) => {
  cbHandler = cbHandler || function (resolve, reject, ...result) {
    if (result.length === 1) { // single arg callback: (result) => {}
      result.error ? reject(result) : resolve(result[0]);
    } else if (result.length == 2) { // standard node callback: (err, data) => {}
      const [err, data] = result;
      err ? reject(err) : resolve(data);
    } else { 
      const [err, ...data] = result;
      err ? reject(err) : resolve(data);
    }
  }
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((...result) => cbHandler(resolve, reject, ...result));
      // keep func bound to caller when called; the `this` inside func will be the caller object
      func.apply(caller, args);
    });
  }
}

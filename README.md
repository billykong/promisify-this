# promisify-this

`promisify-this` has similiar function as node's `util.promisify`, but allows context binding, i.e. `this` can be carried to the promisified function.  

If the caller of the callback style function is required for it to work properly, the binding between the object(owner of the function) and the function must not be lost in the promisification process.

## TODO
- Examples

    
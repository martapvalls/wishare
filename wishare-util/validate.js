const { ContentError } = require('./errors')
const { isTypeOf, isInstanceOf, isEmail } = require('./validators')

const validate = {
    typeOf(type, target) {
        if (!isTypeOf(target, type)) throw new TypeError(`${target} is not a ${type}`)
    },

    string(target) {
        this.typeOf('string', target)
    },

    function(target) {
        this.typeOf('function', target)
    },

    number(target) {
        this.typeOf('number', target)
    },

    boolean(target) {
        this.typeOf('boolean', target)
    },

    instanceOf(type, target) {
        if (!isInstanceOf(target, type)) throw TypeError(`${target} is not a ${type.name}`)
    },

    array(target) {
        this.instanceOf(Array, target)
    },

    email(target) {
        if (!isEmail(String(target).toLowerCase())) throw new ContentError(`${target} is not an e-mail`)
    },

    matches(name, target, ...values) {
        if (!values.includes(target)) throw new ContentError(`${target} does not match any of the valid ${name} values: ${values}`)   
    }
}

validate.string.notVoid = function (name, target) {
    if (!target.trim().length) throw new ContentError(`${name} is empty or blank`)
}


module.exports = validate
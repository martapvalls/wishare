module.exports = function () {
    if (typeof Array.prototype.random !== 'function')
        Array.prototype.random = function () {
            return this[Math.floor(Math.random() * this.length)]
        }
}
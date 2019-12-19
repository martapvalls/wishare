module.exports = function(req) {
    const { headers: { authorization } } = req
    
    let token

    authorization && ([, token] = authorization.split(' '))

    return token
}
const { JWK } = require('jose')

function getJWK() {
    return JWK.asKey("hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg", {
        use: 'sig',
        alg: "HS512"
    })
}

exports.auth = {
    key: getJWK(),
    expiresIn: "3600s"
};
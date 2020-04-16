const { JWT } = require('jose')
const { auth } = require("../../configs/auth");

exports.login = (req, res) => {
    var payload = {};

    payload.sub = req.user.name;
    delete req.user.name;
    payload.user = req.user;
    console.log("login => Payload: " + payload);

    var token = JWT.sign(payload, auth.key, {
        audience: ['urn:dairyhome:client'],
        issuer: 'https://www.homedairy.com',
        expiresIn: auth.expiresIn,
        header: {
            typ: 'JWT'
        }
    })
    res.status(200).send({
        access_token: Buffer.from(token).toString("base64")
    }).end();
}
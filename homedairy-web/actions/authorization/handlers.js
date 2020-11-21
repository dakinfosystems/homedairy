const { JWT } = require('jose')
const { auth } = require("../../configs/auth");

exports.login = (req, res) => {
    var refresh_token;

    if(req.body.refresh_token) {
        refresh_token = req.body.refresh_token;
    } else {
        refresh_token = req.user.refresh_token;
    }

    // console.log(JSON.stringify(results));
    var payload = {};

    payload.sub = req.user.name;
    delete req.user.name;
    payload.user = req.user;
    // console.log("login => Payload: " + payload);
    // console.log("login => req.user: " + JSON.stringify(req.user));

    var token = JWT.sign(payload, auth.key, {
        audience: ['urn:dairyhome:client'],
        issuer: 'https://www.homedairy.com',
        expiresIn: auth.expiresIn,
        header: {
            typ: 'JWT'
        }
    })
    res.status(200).send({
        access_token: Buffer.from(token).toString("base64"),
        refresh_token: refresh_token
    }).end();
}
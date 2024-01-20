const jwt = require("jsonwebtoken")
const secret = require("../secretKey")

module.exports = function (req, res, next) {
    if(req.method == "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.token

        if(!token) {
            return res.json({error: {type: "user", message: "Пользователь не авторизован"}}).status(403)
        }

        const decodedToken = jwt.verify(token, secret)

        req.id = decodedToken.id

        next()
    } catch (error) {
        console.log(error)
        return res.json({error: {type: "user", message: "Пользователь не авторизован"}}).status(403)
    }
}
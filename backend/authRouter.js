const Router = require("express")
const express = require("express")

const registration = require("./controllers/registration.js")
const authorization = require("./controllers/authorization.js")
const authMiddleware = require("./middlewares/authMiddleware.js")
const getInfo = require("./middlewares/getInfo.js")
const addAddress = require("./controllers/addAddress.js")
const deleteAddress = require("./controllers/deletAddress.js")
const updateAddress = require("./controllers/uppdateAddress.js")

const urlencodedParser = express.urlencoded({extended: false});

const router = new Router()

router.post("/registration", urlencodedParser, registration)
router.post("/login", urlencodedParser, authorization)
router.post("/addAddress", urlencodedParser, authMiddleware, addAddress)
router.delete("/deleteAddress", urlencodedParser, authMiddleware, deleteAddress)
router.post("/updateAddress", urlencodedParser, authMiddleware, updateAddress)

router.get("/get-user", authMiddleware, getInfo)

module.exports = router
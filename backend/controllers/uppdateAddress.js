const mysql = require("mysql2")

module.exports = async function deleteAddress(req, res) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "address book",
        password: ""
    });

    connection.connect(function(err) {
        if (err) {
            res.json({error: {type: "server", message: "Ошибка сервера. Попробуйте позже!"}}).status(500)
            return console.error("Ошибка: " + err.message);
        }
        else{
            console.log("Подключение к серверу MySQL успешно установлено");
        }
    });

    const sql = `SELECT * FROM user WHERE id=${req.id}`

    connection.query(sql, function(err, results) {
        if(err) {
            console.log(err)
            res.json({error: {type: "server", message: "Ошибка сервера. Попробуйте позже!"}}).status(500)
        }
        else {
            const array = results[0].addresses
            for(let el of array) {
                if(el.id == req.body.id) {
                    array[array.indexOf(el)].name = req.body.arr.name
                    array[array.indexOf(el)].firstName = req.body.arr.firstName
                    array[array.indexOf(el)].lastName = req.body.arr.lastName
                    array[array.indexOf(el)].email = req.body.arr.email
                    array[array.indexOf(el)].phone = req.body.arr.phone
                    array[array.indexOf(el)].address = req.body.arr.address
                    array[array.indexOf(el)].index = req.body.arr.index
                    array[array.indexOf(el)].city = req.body.arr.city
                    array[array.indexOf(el)].country = req.body.arr.country
                    array[array.indexOf(el)].whoIs = req.body.arr.whoIs
                }
            }
            connection.query("UPDATE `user` SET `addresses` ='" + JSON.stringify(array) + "' WHERE `user`.`id` = " + results[0].id + ";", (err) => {
                if(err) {
                    return console.log(err)
                } else {
                    res.json({addresses: array})
                }
            })
            connection.end()
        }
    });
}
const mysql = require("mysql2")

module.exports = function addAddress(req, res) {
    try {
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
                req.body.id = results[0].addresses.length
                const array = JSON.stringify([...results[0].addresses, req.body])
                connection.query("UPDATE `user` SET `addresses` ='" + array + "' WHERE `user`.`id` = " + results[0].id + ";", (err) => {
                    if(err) {
                        return console.log(err)
                    } else {
                        res.json({addresses: array})
                    }
                })
                connection.end()
            }
        });
    } catch (error) {
        console.log(error)
    }
}
const mysql = require("mysql2")

module.exports = function(req, res) {
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

    connection.query('SELECT * FROM user WHERE id = ?', req.id ,function(err,rows){
        if(err) {
            res.json({error: {type: "server", message: "Ошибка musql"}}).status(500)
            return
        }
        res.json({user: rows[0]})
        connection.end()
    })
}
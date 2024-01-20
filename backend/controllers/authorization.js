const express = require("express")
const bcrypt = require("bcrypt")
const mysql = require("mysql2");
const jwt = require("jsonwebtoken")
const secret = require("../secretKey");

function generateToken(id) {
    const payload = {
        id,
    }

    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

module.exports = async function logIn(req, res) {
    try {
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "address book",
            password: ""
        });
        connection.connect(function(err){
            if (err) {
                res.json({error: {type: "server", message: "Ошибка соеденения"}}).status(500)
                return console.error("Ошибка: " + err.message);
            }
            else{
                console.log("Подключение к серверу MySQL успешно установлено");
            }
        });

        
        connection.query('SELECT * FROM user WHERE name = ?',  req.body.name ,function(err,rows){
            if(err) {
                res.json({error: {type: "server", message: "Ошибка musql"}}).status(500)
                connection.end();
                return console.log(err);
            }

            let user;
            rows.forEach(row => {
                if(row.name == req.body.name) {
                    user = row.name
                    if(bcrypt.compareSync(req.body.password, row.password)) {
                        const token = generateToken(row.id)
                        res.json({token: token})
                        connection.end((err) => {
                            if(err) console.log(err)
                            else console.log("Отключение от MySQL")
                        })
                    } else {
                        res.json({error: {type: "password", message: "Неверный пароль!"}}).status(400)
                        connection.end((err) => {
                            if(err) console.log(err)
                            else console.log("Отключение от MySQL")
                        })
                    }
                }
            })

            if(!user) return res.json({error: {type: "user", message: "Нет пользователя с таким именем!"}}).status(404)
        })
    } catch (error) {
        //console.log(error)
    }
}
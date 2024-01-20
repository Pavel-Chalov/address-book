const express = require("express")
const bcrypt = require("bcrypt")
const mysql = require("mysql2");
const jwt = require("jsonwebtoken")
const {secret} = require("../config");

module.exports = async function registration(req, res) {
    try {
        // Подключение к бд
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "address book",
            password: ""
        });

        connection.connect(function(err){
            if (err) {
                res.json({error: {type: "server", message: "Ошибка сервера. Попробуйте позже!"}}).status(500)
                return console.error("Ошибка: " + err.message);
            }
            else{
                console.log("Подключение к серверу MySQL успешно установлено");
            }
        });

        
        connection.query('SELECT * FROM user WHERE name = ?',  req.body.name ,function(err,rows){
            if(err) {
                res.json({error: {type: "server", message: "Ошибка сервера. Попробуйте позже!"}}).status(500)
                connection.end();
                return console.log(err);
            }
            if(rows.length === 0) {
                bcrypt.genSalt(7, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        const sql = 'INSERT INTO `user`(`id`, `name`, `password`, `addresses`) VALUES('

                        connection.query(sql + `0, '${req.body.name}', '${hash}', '[]')`, function(err, results) {
                            if(err) {
                                res.json({error: {type: "server", message: "Ошибка сервера. Попробуйте позже!"}}).status(500)
                            }
                            else {
                                res.json({success: true}).status(200)
                            }
                        });

                        connection.end((err) => {
                            if(err) console.log(err)
                            else console.log("Отключение от MySQL")
                        })
                    });
                });
            } else res.json({error: {type: "name", message: "Пользователь с таким именем уже есть!"}}).status(400)
        })
            
        
    } catch (error) {
        if(err) {res.json({error: {type: "server", message: "Ошибка сервера. Попробуйте позже!"}}).status(500)}
        console.log(error)
    }
}
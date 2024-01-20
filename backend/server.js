const express = require("express");
const router = require("./authRouter")

const PORT = 5000

const server = express()

server.use(express.json())
server.use("/", router)

function startServer() {
  try {
    server.listen(PORT, () => console.log("Сервер успешно запущен"))
  } catch (error) {
    console.log(error)
  }
}

startServer()
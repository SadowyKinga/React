//odpowiada za utryzmanie rzeczywistego serweru
const express = require("express");
const http = require("http");
const chat = express();
const server = http.createServer(chat);
const socket = require("socket.io"); //wywołanie socket() inicjowania nowej instancji poprzez przekazanie obiektu serwera.
const io = socket(server);

io.on("connection", socket => {
    socket.emit("your id", socket.id);
    socket.on("send message", body => {  // Przyjmuje dwa argumenty: nazwę zdarzenia oraz callback, który zostanie wykonany po każdym zdarzeniu połączenia.
        io.emit("message", body)
    })
})

server.listen(8000, () => console.log("server is running on port 8000"));  //dzięki server.js sprawiamy, by aplikacja nasłuchiwała połączeń przychodzących
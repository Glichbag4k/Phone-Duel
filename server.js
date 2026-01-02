const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

let rooms = new Map();
let players = new Map();
let onlineCount = 0;

const phones = [
    {name:"iPhone 16 Pro Max", battery:"4676 mAh", materials:"Титан", processor:"A18 Pro", camera:"48+12+12+12 МП", screen:'6.9" Super Retina XDR 2796x1290 120Гц', charging:"35 Вт", price:"1299", storage:"1 ТБ", os:"iOS 18", weight:"221 г", brand:"Apple"},
    {name:"iPhone 16", battery:"3561 mAh", materials:"Алюминий", processor:"A17 Pro", camera:"48+12 МП", screen:'6.1" OLED 2556x1179 60Гц', charging:"20 Вт", price:"799", storage:"128 ГБ", os:"iOS 18", weight:"171 г", brand:"Apple"},
    {name:"iPhone SE 4", battery:"3279 mAh", materials:"Алюминий", processor:"A16 Bionic", camera:"48 МП", screen:'6.1" OLED 2532x1170 60Гц', charging:"20 Вт", price:"499", storage:"128 ГБ", os:"iOS 18", weight:"165 г", brand:"Apple"}
];

function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function getRandomPhone() {
    return phones[Math.floor(Math.random() * phones.length)];
}

io.on('connection', (socket) => {
    onlineCount++;
    io.emit('onlineCount', onlineCount);
    
    console.log(`Player connected: ${socket.id}, Online: ${onlineCount}`);
    
    socket.on('createRoom', (playerName) => {
        const roomCode = generateRoomCode();
        const phone = getRandomPhone();
        
        const room = {
            code: roomCode,
            host: socket.id,
            players: [{
                id: socket.id,
                name: playerName,
                phone: phone,
                ready: false,
                isHost: true
            }],
            gameStarted: false,
            maxPlayers: 2
        };
        
        rooms.set(roomCode, room);
        players.set(socket.id, { roomCode, playerName });
        
        socket.join(roomCode);
        socket.emit('roomCreated', { roomCode, phone });
        
        console.log(`Room created: ${roomCode} by ${playerName}`);
        io.emit('roomListUpdate', Array.from(rooms.values()));
    });
    
    socket.on('joinRoom', ({ roomCode, playerName }) => {
        const room = rooms.get(roomCode);
        
        if (!room) {
            socket.emit('error', 'Комната не найдена');
            return;
        }
        
        if (room.players.length >= room.maxPlayers) {
            socket.emit('error', 'Комната заполнена');
            return;
        }
        
        if (room.gameStarted) {
            socket.emit('error', 'Игра уже началась');
            return;
        }
        
        const phone = getRandomPhone();
        const player = {
            id: socket.id,
            name: playerName,
            phone: phone,
            ready: false,
            isHost: false
        };
        
        room.players.push(player);
        rooms.set(roomCode, room);
        players.set(socket.id, { roomCode, playerName });
        
        socket.join(roomCode);
        socket.emit('roomJoined', { phone, room });
        
        io.to(roomCode).emit('playerJoined', player);
        io.to(roomCode).emit('roomUpdate', room);
        
        console.log(`${playerName} joined room ${roomCode}`);
        io.emit('roomListUpdate', Array.from(rooms.values()));
    });
    
    socket.on('setReady', (ready) => {
        const playerInfo = players.get(socket.id);
        if (!playerInfo) return;
        
        const room = rooms.get(playerInfo.roomCode);
        if (!room) return;
        
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.ready = ready;
            rooms.set(playerInfo.roomCode, room);
            
            io.to(playerInfo.roomCode).emit('playerReady', { playerId: socket.id, ready });
            io.to(playerInfo.roomCode).emit('roomUpdate', room);
            
            const allReady = room.players.every(p => p.ready);
            if (allReady && room.players.length === room.maxPlayers) {
                room.gameStarted = true;
                rooms.set(playerInfo.roomCode, room);
                
                io.to(playerInfo.roomCode).emit('gameStart', room);
            }
        }
    });
    
    socket.on('sendMessage', ({ roomCode, message }) => {
        const playerInfo = players.get(socket.id);
        if (!playerInfo) return;
        
        io.to(roomCode).emit('messageReceived', {
            playerId: socket.id,
            playerName: playerInfo.playerName,
            message: message,
            timestamp: new Date().toISOString()
        });
    });
    
    socket.on('askAttribute', ({ roomCode, attribute }) => {
        const room = rooms.get(roomCode);
        if (!room || !room.gameStarted) return;
        
        const askingPlayer = room.players.find(p => p.id === socket.id);
        const opponent = room.players.find(p => p.id !== socket.id);
        
        if (!askingPlayer || !opponent) return;
        
        const value = opponent.phone[attribute];
        
        io.to(socket.id).emit('attributeRevealed', { attribute, value });
        io.to(roomCode).emit('attributeAsked', {
            playerId: socket.id,
            playerName: askingPlayer.name,
            attribute: attribute
        });
    });
    
    socket.on('makeGuess', ({ roomCode, guess }) => {
        const room = rooms.get(roomCode);
        if (!room || !room.gameStarted) return;
        
        const guessingPlayer = room.players.find(p => p.id === socket.id);
        const opponent = room.players.find(p => p.id !== socket.id);
        
        if (!guessingPlayer || !opponent) return;
        
        const isCorrect = guess.toLowerCase() === opponent.phone.name.toLowerCase();
        
        if (isCorrect) {
            io.to(roomCode).emit('gameEnd', {
                winner: guessingPlayer.name,
                winnerPhone: guessingPlayer.phone.name,
                opponentPhone: opponent.phone.name
            });
            
            rooms.delete(roomCode);
        } else {
            io.to(socket.id).emit('guessResult', { correct: false, guess });
        }
    });
    
    socket.on('getRoomList', () => {
        socket.emit('roomListUpdate', Array.from(rooms.values()));
    });
    
    socket.on('disconnect', () => {
        onlineCount--;
        io.emit('onlineCount', onlineCount);
        
        const playerInfo = players.get(socket.id);
        if (playerInfo) {
            const room = rooms.get(playerInfo.roomCode);
            if (room) {
                room.players = room.players.filter(p => p.id !== socket.id);
                
                if (room.players.length === 0) {
                    rooms.delete(playerInfo.roomCode);
                } else {
                    if (room.host === socket.id) {
                        room.host = room.players[0].id;
                        room.players[0].isHost = true;
                    }
                    rooms.set(playerInfo.roomCode, room);
                    io.to(playerInfo.roomCode).emit('playerLeft', { playerId: socket.id });
                    io.to(playerInfo.roomCode).emit('roomUpdate', room);
                }
                
                io.emit('roomListUpdate', Array.from(rooms.values()));
            }
            players.delete(socket.id);
        }
        
        console.log(`Player disconnected: ${socket.id}, Online: ${onlineCount}`);
    });
});

app.get('/api/online-count', (req, res) => {
    res.json({ count: onlineCount });
});

app.get('/api/rooms', (req, res) => {
    res.json(Array.from(rooms.values()));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
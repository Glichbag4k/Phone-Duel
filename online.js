const socket = io('http://localhost:3000');

let currentRoom = null;
let playerName = '';
let playerPhone = null;
let isHost = false;

socket.on('connect', () => {
    console.log('Connected to server');
    updateOnlineStatus(true);
});

socket.on('onlineCount', (count) => {
    document.getElementById('onlineCount').textContent = count;
});

socket.on('roomCreated', (data) => {
    currentRoom = data.roomCode;
    playerPhone = data.phone;
    isHost = true;
    
    document.getElementById('roomCodeDisplay').textContent = `DUEL-${currentRoom}`;
    document.getElementById('inviteLink').style.display = 'block';
    document.getElementById('inviteUrl').textContent = 
        `${window.location.origin}?room=${currentRoom}`;
    
    updatePlayerDisplay();
    updateConnectionStatus('Комната создана! Ожидайте второго игрока...', 'success');
});

socket.on('roomJoined', (data) => {
    currentRoom = data.room.code;
    playerPhone = data.phone;
    isHost = false;
    
    document.getElementById('roomCodeDisplay').textContent = `DUEL-${currentRoom}`;
    document.getElementById('inviteLink').style.display = 'none';
    
    updatePlayerDisplay();
    updateRoomPlayers(data.room.players);
    updateConnectionStatus('Вы присоединились к комнате!', 'success');
});

socket.on('error', (message) => {
    showNotification(message, 'error');
});

socket.on('roomUpdate', (room) => {
    updateRoomPlayers(room.players);
});

socket.on('playerJoined', (player) => {
    showNotification(`${player.name} присоединился к комнате!`, 'success');
    addChatMessage('system', `${player.name} присоединился к комнате`);
});

socket.on('playerLeft', (data) => {
    showNotification('Игрок покинул комнату', 'warning');
    addChatMessage('system', 'Игрок покинул комнату');
});

socket.on('playerReady', (data) => {
    const playerElement = document.querySelector(`[data-player-id="${data.playerId}"]`);
    if (playerElement) {
        const statusElement = playerElement.querySelector('.player-status');
        statusElement.textContent = data.ready ? 'Готов' : 'Не готов';
        statusElement.className = data.ready ? 'player-ready' : 'player-waiting';
    }
});

socket.on('gameStart', (room) => {
    showNotification('Игра начинается!', 'success');
    addChatMessage('system', 'Игра начинается!');
    
    document.getElementById('readyBtn').disabled = true;
    document.getElementById('readyBtn').textContent = 'ИГРА НАЧАЛАСЬ';
    
    setTimeout(() => {
        window.location.href = 'game-online.html';
    }, 2000);
});

socket.on('messageReceived', (data) => {
    const isCurrentPlayer = socket.id === data.playerId;
    addChatMessage(isCurrentPlayer ? 'player' : 'opponent', data.message);
});

socket.on('roomListUpdate', (roomsList) => {
    updateRoomList(roomsList);
});

function createRoom() {
    playerName = document.getElementById('onlinePlayer').value.trim();
    if (!playerName) {
        showNotification('Введите ваше имя', 'error');
        return;
    }
    
    socket.emit('createRoom', playerName);
}

function joinRoom() {
    playerName = document.getElementById('onlinePlayer').value.trim();
    const roomCode = document.getElementById('roomCode').value.trim();
    
    if (!playerName) {
        showNotification('Введите ваше имя', 'error');
        return;
    }
    
    if (!roomCode || roomCode.length !== 4) {
        showNotification('Введите 4-значный код комнаты', 'error');
        return;
    }
    
    socket.emit('joinRoom', { roomCode, playerName });
}

function toggleReady() {
    const readyBtn = document.getElementById('readyBtn');
    const isReady = readyBtn.textContent === 'ГОТОВ' || readyBtn.textContent === 'ПРИГОТОВИТЬСЯ';
    
    if (isReady) {
        socket.emit('setReady', true);
        readyBtn.textContent = 'ОТМЕНИТЬ';
        readyBtn.style.background = 'linear-gradient(90deg, var(--warning), #ffaa00)';
    } else {
        socket.emit('setReady', false);
        readyBtn.textContent = 'ГОТОВ';
        readyBtn.style.background = 'linear-gradient(90deg, var(--success), #00ffaa)';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentRoom) return;
    
    socket.emit('sendMessage', { roomCode: currentRoom, message });
    input.value = '';
}

function updateOnlineStatus(connected) {
    const status = document.getElementById('connectionStatus');
    const icon = document.getElementById('statusIcon');
    const message = document.getElementById('statusMessage');
    
    if (connected) {
        status.className = 'connection-status status-connected';
        icon.textContent = '✅';
        message.textContent = 'Подключено к серверу';
    } else {
        status.className = 'connection-status status-disconnected';
        icon.textContent = '❌';
        message.textContent = 'Нет подключения';
    }
}

function updatePlayerDisplay() {
    document.getElementById('playerName1').textContent = playerName;
    document.getElementById('playerStatus1').textContent = 'Не готов';
    document.getElementById('playerCard1').classList.add('active');
    
    if (playerPhone) {
        const details = document.getElementById('playerPhoneDetails');
        details.innerHTML = `
            <div><strong>Ваш телефон:</strong> ${playerPhone.name}</div>
            <div><strong>Процессор:</strong> ${playerPhone.processor}</div>
            <div><strong>Аккумулятор:</strong> ${playerPhone.battery}</div>
        `;
    }
}

function updateRoomPlayers(players) {
    const playerCard1 = document.getElementById('playerCard1');
    const playerCard2 = document.getElementById('playerCard2');
    
    playerCard1.querySelector('.player-name').textContent = players[0]?.name || 'Ожидание...';
    playerCard1.querySelector('.player-status').textContent = players[0]?.ready ? 'Готов' : 'Не готов';
    playerCard1.querySelector('.player-status').className = players[0]?.ready ? 'player-ready' : 'player-waiting';
    
    if (players[1]) {
        playerCard2.querySelector('.player-name').textContent = players[1].name;
        playerCard2.querySelector('.player-status').textContent = players[1].ready ? 'Готов' : 'Не готов';
        playerCard2.querySelector('.player-status').className = players[1].ready ? 'player-ready' : 'player-waiting';
        playerCard2.style.display = 'block';
    } else {
        playerCard2.style.display = 'none';
    }
}

function updateRoomList(roomsList) {
    const roomList = document.getElementById('roomList');
    roomList.innerHTML = '';
    
    if (roomsList.length === 0) {
        roomList.innerHTML = `
            <div class="room-item">
                <div class="room-info">
                    <div class="room-name">Нет активных комнат</div>
                    <div class="room-players">Создайте свою комнату!</div>
                </div>
                <button class="btn-join" onclick="createRoom()">Создать</button>
            </div>
        `;
        return;
    }
    
    roomsList.forEach(room => {
        if (room.gameStarted) return;
        
        const roomItem = document.createElement('div');
        roomItem.className = 'room-item';
        roomItem.innerHTML = `
            <div class="room-info">
                <div class="room-name">Комната: DUEL-${room.code}</div>
                <div class="room-players">👤 ${room.players.length}/${room.maxPlayers} игроков</div>
            </div>
            <button class="btn-join" onclick="joinRoomFromList('${room.code}')" ${room.players.length >= room.maxPlayers ? 'disabled' : ''}>
                ${room.players.length >= room.maxPlayers ? 'ЗАНЯТО' : 'ПРИСОЕДИНИТЬСЯ'}
            </button>
        `;
        roomList.appendChild(roomItem);
    });
}

function joinRoomFromList(code) {
    document.getElementById('roomCode').value = code;
    joinRoom();
}

function addChatMessage(type, content) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    let sender = '';
    if (type === 'player') {
        sender = `<span class="message-sender">Вы:</span>`;
    } else if (type === 'opponent') {
        sender = `<span class="message-sender">Соперник:</span>`;
    }
    
    messageDiv.innerHTML = `${sender}${content}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'linear-gradient(90deg, #ff4444, #ff8888)' : 'linear-gradient(90deg, #08f0ff, #0ff8d1)'};
        color: ${type === 'error' ? 'white' : 'black'};
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Share Tech Mono', monospace;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updateConnectionStatus(message, type = 'info') {
    const statusDetails = document.getElementById('statusDetails');
    statusDetails.textContent = message;
    statusDetails.style.color = type === 'success' ? '#0ff8d1' : 
                               type === 'error' ? '#ff4444' : 
                               '#ffaa00';
}

document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    playerName = localStorage.getItem('playerName') || 'Игрок';
    document.getElementById('onlinePlayer').value = playerName;
    
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl) {
        document.getElementById('roomCode').value = roomFromUrl;
    }
    
    socket.emit('getRoomList');
});
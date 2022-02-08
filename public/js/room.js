const socket = io();
const chatForm = document.getElementById('chat-form');
const messageBox = document.querySelector('.chat-messages');
const room = sessionStorage.getItem("room");
const typing = document.getElementById('typing');
const logout = document.getElementById('logout');

// get user from cookies
const getUser = () => {
   let user = document.cookie.split('=')
   for(let i = 0; i < user.length; i++) {
        if (user[i] === "user") {
            let position = i + 1
            user = JSON.parse(decodeURIComponent(user[position]))
            return user
        }
   }
}
let user = getUser();

logout.addEventListener('click', () => {
    sessionStorage.removeItem('room')
    document.cookie = "user" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.reload();
})

// everytime page refreshes or just joining room, fetch all messages saved in database
window.onload = function() {
    loadMessages(room);
    document.getElementById('room-name').innerHTML = `Room Name: ${room}`
}

// each new message is pushed
socket.on('message', (message) => {
    displayNewMessage(message);
    document.getElementById('typing').innerHTML = ""
})

// sets the "User is typing..."
socket.on('typingMessage', (message) => {
    document.getElementById('typing').innerHTML = message
})

// send room variable to server side socket
socket.emit('joinRoom', room)

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();    
    fetch(`http://localhost:3000/send-group-message`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                from_user: user.username,
                room: room,
                message: event.target.elements.message.value,
                date_sent: Date.now()
            }
        )
    })
    .then(msg = event.target.elements.message.value)
    .then(userName = user.username)
    .then(time = Date.now())
    .then(
        socket.emit('chatMessage', { msg, userName, time }))
    .then(event.target.elements.message.value="")
    .then(event.target.elements.message.focus())
        
})

chatForm.addEventListener('input', (event) => {
    let input = event.currentTarget.message.value;
    if (input === "") {
        socket.emit('typing', "")
    }
    else {
        socket.emit('typing', `${user.username} is typing...`)
    }
    
})

const loadMessages = (room) => {
    // fetch all messages
    fetch(`http://localhost:3000/get-messages/${room}`)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(message => {
                let chatMsg = document.createElement('div');
                chatMsg.classList.add('message');
                let time = message.date_sent;
                time = Date.parse(time);
                time = new Date(time);
                let hours = time.getHours();
                let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
                let formattedTime = hours + ":" + minutes
                chatMsg.innerHTML = `<p class="title">${message.from_user === user.username ? message.from_user + " (me)" : message.from_user}<small>${formattedTime}</small></p>
                <p>
                    ${message.message}
                </p>`;
                document.querySelector('.chat-messages').appendChild(chatMsg);
                messageBox.scrollTop = messageBox.scrollHeight;
            })      
        })
    
}

const displayNewMessage = (message) => {
    const chatMsg = document.createElement('div');
    chatMsg.classList.add('message');
    time = new Date(message.time);
    let hours = time.getHours();
    let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    let formattedTime = hours + ":" + minutes
    chatMsg.innerHTML = `<p class="title">${message.userName === user.username ? message.userName + " (me)" : message.userName} <small>${formattedTime}</small></p>
    <p class="text">
        ${message.msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(chatMsg);
    messageBox.scrollTop = messageBox.scrollHeight;
}
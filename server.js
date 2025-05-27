// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:8000'); // Connect to the server

    // DOM Elements
    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector('.container');

    // Function to append messages to the chat container
    function appendMessage(message, position) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', position);
        messageElement.innerText = message;
        messageContainer.appendChild(messageElement);
    }

    // Prompt user for their name
    let name = sessionStorage.getItem('chatName');
    if (!name) {
        name = prompt('Enter your name to join the chat:');
        sessionStorage.setItem('chatName', name); // Save name to sessionStorage
    }

    // Notify the server about the new user
    socket.emit('new-user-joined', name);

    // Handle welcome message for the current user
    socket.on('welcome', (message) => {
        appendMessage(message, 'right');
    });

    // Handle when a new user joins
    socket.on('user-joined', (name) => {
        appendMessage(`${name} joined the chat`, 'left');
    });

    // Handle receiving messages
    socket.on('receive', (data) => {
        appendMessage(`${data.name}: ${data.message}`, 'left');
    });

    // Handle when a user leaves
    socket.on('user-left', (name) => {
        appendMessage(`${name} left the chat`, 'left');
    });

    // Handle form submission (sending messages)
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form reload
        const message = messageInput.value;
        appendMessage(`You: ${message}`, 'right'); // Display your message
        socket.emit('send', message); // Send message to the server
        messageInput.value = ''; // Clear input
    });
});





// server.js
// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//     cors: {
//         origin: '*',
//     }
// });

// // Serve your frontend files
// app.use(express.static(path.join(__dirname)));

// const users = {};

// io.on('connection', socket => {
//     socket.on('new-user-joined', name => {
//         users[socket.id] = name;
//         socket.emit('welcome', `Welcome to the chat, ${name}!`);
//         socket.broadcast.emit('user-joined', name);
//     });

//     socket.on('send', message => {
//         const name = users[socket.id];
//         socket.broadcast.emit('receive', { message, name });
//     });

//     socket.on('disconnect', () => {
//         const name = users[socket.id];
//         if (name) {
//             socket.broadcast.emit('user-left', name);
//             delete users[socket.id];
//         }
//     });
// });

// server.listen(8000, () => {
//     console.log('✅ Server running on http://localhost:8000');
// });

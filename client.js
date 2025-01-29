// WARNING: the client will NOT be able to connect!
// const socket = io('http://localhost:8000');
// const form = document.getElementById('send-container');
// const messageInput = document.getElementById('messageInp');
// const messageContainer = document.querySelector('.container');

// let names = prompt("Enter your name to join the chats");
// socket.emit('new-user-joined', names);



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

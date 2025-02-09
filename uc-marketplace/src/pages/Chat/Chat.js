let socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
  console.log('Connection established');
  socket.send('Hello Server');
};

socket.onmessage = function(event) {
  console.log('Message from server:', event.data);
  let chat = document.getElementById('chat');
  chat.innerHTML += '<div>' + event.data + '</div>';
};

socket.onclose = function(event) {
  console.log('WebSocket Connection closed');
};

socket.onerror = function(error) {
  console.log('WebSocket Error:', error);
};

function sendMessage() {
    let messageInput = document.getElementById('messageInput');
    let message = messageInput.value;
    socket.send(message);
    messageInput.value = '';
};
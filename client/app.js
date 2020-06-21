const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");
const messageAuthor = document.querySelector('.message__author');

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', (user) => addMessage('Chat Bot', user + ' has joined the converstaion!'));
socket.on('removeUser', (user) => addMessage('Chat Bot', user + ' has left the conversation... :('));
let userName = '';

loginForm.addEventListener('submit', (event) => {
  login(event);
});

addMessageForm.addEventListener('submit', (event) =>{
  sendMessage(event);
});

const login = event => {
  
  event.preventDefault();

  if (userNameInput.value === '') {
    alert('Please enter Login')
  }

  else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', userName);
  }
} 

function addMessage( user, text){
  
  const message = document.createElement('li');
  const author = document.createElement('h3');
  const textMessage = document.createElement('div');

  message.classList.add('message', 'message--received');
  author.classList.add('message__author');
  author.innerHTML = `${userName === user ? 'You' : user }`;

  textMessage.classList.add('message__content');
  textMessage.innerHTML = text;

  if( user === userName){
    message.classList.add('message--self')
  }

  message.appendChild(author);
  message.appendChild(textMessage);
  messagesList.appendChild(message);
};

const sendMessage = event =>{
  event.preventDefault();

  if (messageContentInput.value === '') {
    alert('Please enter message');
  } else {
   addMessage(userName, messageContentInput.value);
   socket.emit('message', { author: userName, content: messageContentInput.value })
   messageContentInput.value = '';   
  }
}
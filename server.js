const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

const comments = JSON.parse(fs.readFileSync('./static/comments.json'));

let speed = 2; // message/sec
let messageCounter = 0;
timerFunction = () => {
  messageCounter = ++messageCounter % 4000;
  io.emit('message', comments[messageCounter]);
};
let timer = setInterval(() => {
  timerFunction();
}, 1000 / speed);

io.on('connection', socket => {
  console.log('Hello!');

  socket.on('disconnect', () => {
    console.log('Bye~');
  });

  socket.on('change speed', function(newSpeed) {
    speed = Math.abs(newSpeed) || 1;
    clearInterval(timer);
    timer = setInterval(() => {
      timerFunction();
    }, 1000 / speed);
  });
});

server.listen(5000, () => {
  console.log('Server Started. http://localhost:5000');
});

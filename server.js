const express = require("express"),
app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require('./db.js');
const cors = require( 'cors');
dotenv.config();
let server = require('http').createServer(app);
const io = require('socket.io')(server);  //for server connection

io.on('connection', (socket)=>{
  console.log(socket);

socket.on('disconnect',function(){
io.emit('user-changes', {user: socket.username, event: 'left'});
});
socket.on('set-name', (name)=>{
  console.timeLog('User name', name)
  socket.username = name;
  io.emit('user-changes' ,{name, event: 'jointed'});
});
socket.on('send-message',(message)=>{
  io.emit('message', {user: socket.username, msg:message.text, created: new Date()});
});
}) 


const userRoutes = require( './routes/userRoutes.js');
const centerRoutes = require('./routes/centerRoutes');
const commentsRoutes = require('./routes/commentRoutes');

connectDb();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/users', userRoutes);
app.use('api/centers',centerRoutes);
app.use('api/comments', commentsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));
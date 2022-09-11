const express = require("express"),
app = express();
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require('./db.js');
const cors = require( 'cors');
dotenv.config();
let apps = require('express')();
let http = require('http').Server(apps);
let io = require('socket.io')(http);





const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:8200',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
};

 // Enable preflight requests for all routes
 //app.options('*', cors(corsOptions));
 app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:8200"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });
 app.use(cors());


const userRoutes = require( './routes/userRoutes.js');
const centerRoutes = require('./routes/centerRoutes');
const commentsRoutes = require('./routes/commentRoutes');

connectDb();

app.use(express.json());
app.use(morgan('dev'));


app.use('/api/users', userRoutes);
app.use('/api/centers',centerRoutes);
app.use('/api/comments', commentsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));
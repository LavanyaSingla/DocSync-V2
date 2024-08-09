const mongoose = require('mongoose');
const Document = require('./models/DocumentSchema/document');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const session = require('express-session');
const config = require('./config/config.js');
const authController = require('./controllers/authController.js');
const { authJwt } = require('./middleware/index.js');
const jwt = require('jsonwebtoken');

mongoose.connect("mongodb://localhost:27017/Group-Docs", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    },
});

const defaultValue = "";

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Authentication routes (excluded from authJwt middleware)
app.post('/signup', authController.signUp);
app.post('/signin', authController.signIn);
app.post('/signout', authController.signOut);

// Apply authJwt middleware to all routes below this line
app.use(authJwt);

// Protected routes
app.get('/protected-route', (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// Middleware to verify token for socket connections
io.use((socket, next) => {
    let token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication Error"));

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return next(new Error("Authentication Error"));
        socket.userId = decoded.id;
        next();
    });
});

io.on("connection", socket => {
    socket.on('get-document', async documentId => {
        const docData = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', docData.data);

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data });
        });
    });
    console.log("connected to client");
});

async function findOrCreateDocument(id) {
    if (id == null) return;
    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
}

server.listen(3001, () => {
    console.log(`Server is running on port 3001`);
});

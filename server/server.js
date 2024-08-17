// import mongoose from 'mongoose';
// import Document from './models/DocumentSchema/document';
import express from 'express';
// import bodyParser from 'body-parser';
import cors from 'cors';
// import http from 'http';
// import session from 'express-session';
// import config from './config/config.js';
// import { authJwt } from './middleware/index.js';
// import jwt from 'jsonwebtoken';
import connectDb from './config/db.js';
// import { Socket } from 'socket.io';
import route from './routes/route.js';

const app = express();
connectDb();

// // Middleware Setup
app.use(cors());
app.use(express.json());

//Routes
app.use("/api", route);

// const server = http.createServer(app);
// const io = Socket(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ['GET', 'POST']
//     },
// });

// const defaultValue = "";


// app.use(bodyParser.json());
// app.use(session({
//     secret: config.secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
// }));


// // Middleware to verify token for socket connections
// io.use((socket, next) => {
//     let token = socket.handshake.auth.token;
//     if (!token) return next(new Error("Authentication Error"));

//     jwt.verify(token, config.secret, (err, decoded) => {
//         if (err) return next(new Error("Authentication Error"));
//         socket.userId = decoded.id;
//         next();
//     });
// });

// io.on("connection", socket => {
//     socket.on('get-document', async documentId => {
//         const docData = await findOrCreateDocument(documentId);
//         socket.join(documentId);
//         socket.emit('load-document', docData.data);

//         socket.on('send-changes', delta => {
//             socket.broadcast.to(documentId).emit('receive-changes', delta);
//         });

//         socket.on("save-document", async data => {
//             await Document.findByIdAndUpdate(documentId, { data });
//         });
//     });
//     console.log("connected to client");
// });

// async function findOrCreateDocument(id) {
//     if (id == null) return;
//     const document = await Document.findById(id);
//     if (document) return document;
//     return await Document.create({ _id: id, data: defaultValue });
// }

app.listen(3001, () => {
    console.log(`Server is running on port 3001`);
});

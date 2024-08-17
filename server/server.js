import express from 'express';
import { createServer } from 'http';  // HTTP server for socket.io
import { Server } from 'socket.io';   // Socket.io server
import cors from 'cors';
import route from './routes/route.js';
import connectDb from './config/db.js';
import Document from './models/DocumentSchema/document.js';  // Ensure your Document model is correctly imported

const app = express();
connectDb();

// Middleware
app.use(cors());
app.use(express.json());

// HTTP Routes
app.use("/api", route);

// Create HTTP server instance for Socket.io
const server = createServer(app);

// Create Socket.io instance and attach it to the server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",  // Allow CORS from the client
        methods: ["GET", "POST"]
    }
});

// Socket.io logic (for real-time communication)
io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    // Listen for the 'get-document' event
    socket.on('get-document', async (documentId) => {
        // Handle document retrieval or creation
        const document = await Document.findById(documentId);
        
        if (!document) {
            socket.emit('error', 'Document not found');
            return;
        }
        socket.join(documentId);  // Join a room based on document ID
        socket.emit('load-document', document.content);

        // Listen for real-time changes from clients and broadcast to other clients
        socket.on('send-changes', (delta) => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        // Save document data when client triggers save
        socket.on('save-document', async (data) => {
            try {
                await Document.findByIdAndUpdate(documentId, { content: data }, { new: true });
            } catch (error) {
                console.error("Error saving document:", error);
            }
        });

    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
        console.log("WebSocket disconnected");
    });
});

// Function to find or create a document
async function findOrCreateDocument(id) {
    if (id == null) return;

    // Try to find the document by its ID
    let document = await Document.findById(id);
    return document;
}

// Start the server on a given port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

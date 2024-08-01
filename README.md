# DocSync

DocSync is a collaborative document editing tool designed to enable multiple users to work on documents simultaneously. Built using React, Mongoose, Socket.io, and Quill, DocSync provides real-time synchronization and editing features akin to Google Docs.

## Features

- **Real-time Collaboration**: Edit documents together with other users in real-time.
- **Version Control**: Automatically save document changes at regular intervals of 2 seconds.
- **Text Formatting**: Use rich text formatting options including headings, lists, and more with Quill.
- **Document Management**: Create and access documents by unique IDs.

## Technologies Used

- **Frontend**: React.js, Quill
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB, Mongoose

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB (local or cloud-based)

### Setup

1. **Clone the Repository**

   ```sh
   git clone https://github.com/LavanyaSinglaDocSync.git
   cd DocSync

2. **Install Dependencies**

    For the server:

    ```sh
    cd server
    npm install

For the client:

    ```sh
    cd ../client
    npm install

    Configure Environment Variables

3. **Create a .env file in the server directory with the following content:**

    env
    MONGO_URI=mongodb://localhost:27017/DocSync

4. **Start the Server**

    ```sh
    cd server
    npm run start

5. **Start the Client**

    ```sh
    cd client
    npm run start

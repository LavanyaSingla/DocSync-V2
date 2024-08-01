const mongoose = require('mongoose');
const Document = require('./models/DocumentSchema/document');

mongoose.connect("mongodb://localhost/group-docs",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
});

const defaultValue ="";

const io = require('socket.io')(3001,
    {
        cors:{
            origin:"http://localhost:3000",
            methods:['GET','POST']
        },
    }
);

io.on("connection",socket=>{
    socket.on('get-document', async documentId =>{
        const docData = await findOrCreateDocument(documentId)
        socket.join(documentId);
        socket.emit('load-document',docData.data);

        socket.on('send-changes',delta=>{
            socket.broadcast.emit('receive-changes',delta)
        })

        socket.on("save-document", async data =>{
            await Document.findByIdAndUpdate(documentId,{data});
        })
    })
    console.log("connected to client");
});

async function findOrCreateDocument(id){
    if(id ==  null) return;
    const document = await Document.findById(id);
    if(document) return document
    return await Document.create({_id:id,data:defaultValue});

}
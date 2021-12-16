const http=require('http')
const express=require('express')
const cors=require('cors')
const socketIO=require('socket.io')
const { Socket } = require('dgram')
const port=8080|| process.env.PORT
const app=express()
app.use(cors())
const users=[{}]
app.get('/',(req,res)=>{
    res.send("hello form server")
})

const server=http.createServer(app)
const io=socketIO(server)
io.on('connection',(socket)=>{
    console.log("new connection");

    socket.on('joining',({user})=>{
        users[socket.id]=user
        console.log(`${user} has joined`);
        socket.broadcast.emit('userMessage',{user:"admin",message:`${users[socket.id]} has joined`})
        socket.emit('welcome',{user:"admin",message:` Welcome to the chat ${users[socket.id]}`})
        
    })
    socket.on('message',({message,id})=>{
        console.log(message);
        io.emit('sendMessage',{user:users[id],message,id})

    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} has left`})
        console.log("user Left");
    })
    
})

server.listen(port,()=>{
    console.log(`server is worlking on ${port}`);
})
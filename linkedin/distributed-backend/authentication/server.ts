const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://user_db:27017/linkedin-users', { useNewUrlParser: true, useUnifiedTopology: true, directConnection: true });
const db = mongoose.connection;

db.on('error', (err:any) => {
    console.log(err);
})
db.once('open', () => {
    console.log('Connected to post database!');
})

const userRouter = require('./routes/users');
app.use('/users', userRouter);
// app.get('/users',(req:any,res:any)=>{
//     res.send("......................")
// })

app.listen(5050,()=>{
     console.log("User Server is running on port 5050");
 });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/linkedin",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err : Error|null|undefined) => {
//     console.error(err);
//   });

mongoose.connect('mongodb://user_db:27017/linkedin-users', { useNewUrlParser: true, useUnifiedTopology: true, directConnection: true });
const db = mongoose.connection;

db.on('error', (err:any) => {
    console.log(err);
})
db.once('open', () => {
    console.log('Connected to user database!');
})

const userRouter = require('./routes/users');
app.use('/users', userRouter);

app.listen(5050,()=>{
     console.log("User Server is running on port 5050");
 });


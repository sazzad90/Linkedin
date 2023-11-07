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

mongoose.connect('mongodb://post:27017/linkedin-posts', { useNewUrlParser: true, useUnifiedTopology: true, directConnection: true });
const db = mongoose.connection;

db.on('error', (err:any) => {
    console.log(err);
})
db.once('open', () => {
    console.log('Connected to user database!');
})


const postRouter = require('./routes/posts');
app.use('/posts', postRouter);

app.listen(5051,()=>{
     console.log("Post Server is running on port 5051");
 });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/linkedin",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err : Error|null|undefined) => {
    console.error(err);
  });

const userRouter = require('./routes/users');
app.use('/users', userRouter);

app.listen(5050,()=>{
     console.log("User Server is running on port 5050");
 });


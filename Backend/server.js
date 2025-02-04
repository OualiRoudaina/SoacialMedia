const express = require('express')
const mongoose = require('mongoose');
const config = require('config')
const cors = require('cors');
const post = require('./routes/post');
const authRoutes = require('./routes/auth');

const app = express()

app.use(express.json())
app.use(cors())


const mongo_url = config.get('mongo_url')
mongoose.set('strictQuery', true)
mongoose
    .connect(mongo_url)
    .then(()=>console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.use("/post",post)
app.use("/api/auth", authRoutes);





const port = process.env.PORT || 3001
app.listen(port,() => console.log('Connected Server'))

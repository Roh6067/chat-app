const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

dotenv.config();
const PORT = process.env.PORT

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`);
})
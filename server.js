require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const room = require('./models/Room');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('connected'))
.catch((err)=>console.error('connection error',err));

app.post('/bookRoom', async (req, res) => {
    try {
        const { roomId, userEmail, startTime, endTime, roomType } = req.body;
        const newBooking = new room({
            roomId,
            userEmail,
            startTime,
            endTime,
            roomType
        });
        const savedBooking = await newBooking.save();
        return res.status(201).json({ 
            message: 'room booked successfully', 
            booking: savedBooking 
        });

    } catch (err) {
        console.error('Error saving to MongoDB:', err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});


app.get('/displayRoom', async (req, res) => {
    try {
        const bookings = await room.find(); 
        return res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching from MongoDB:', err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

const PORT=process.env.PORT;
app.listen(PORT, () => {
    console.log('server is running');
})

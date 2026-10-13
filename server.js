require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Room = require('./models/Room'); // Changed to capitalized 'Room' for consistency

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('connected'))
.catch((err)=>console.error('connection error',err));

app.post('/book', async (req, res) => {
  try {
    const { userEmail, roomId, startTime, endTime, roomType } = req.body;

    // --- 1. Unique Email Check ---
    const existingBooking = await Room.findOne({ userEmail: userEmail.toLowerCase().trim() });
    if (existingBooking) {
      return res.status(400).json({ message: "This email address has already booked a room." });
    }

 
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    
    const overlappingBooking = await Room.findOne({
      roomId: roomId,
      startTime: { $lt: newEnd },  
      endTime: { $gt: newStart }    
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "This room is already booked for the selected time slot." });
    }

    
    const newRoom = new Room({ roomId, userEmail, startTime, endTime, roomType });
    await newRoom.save();
    
    res.status(201).json({ message: "Booking successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/displayRoom', async (req, res) => {
    try {
        const bookings = await Room.find(); 
        return res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching from MongoDB:', err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

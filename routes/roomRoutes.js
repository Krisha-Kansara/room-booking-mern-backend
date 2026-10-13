// routes/roomRoutes.js (or controllers/roomController.js)
const express = require('express');
const router = express.Router();
const Room = require('../models/Room'); // Imports your schema file

// The API endpoint where users submit a booking form
router.post('/book-room', async (req, res) => {
  try {
    const { roomId, userEmail, startTime, endTime, roomType } = req.body;

    // --- STEP 1: CONVERT INPUTS TO JAVASCRIPT DATES ---
    // (JavaScript needs ISO or YYYY-MM-DD formats to compare them correctly)
    const newStart = new Date(startTime); 
    const newEnd = new Date(endTime);

    // --- STEP 2: RUN THE BASIC LOGIC CHECK ---
    const conflict = await Room.findOne({
      roomId: roomId,
      startTime: { $lt: newEnd },   // Starts before new one finishes
      endTime: { $gt: newStart }    // Ends after new one starts
    });

    // --- STEP 3: BLOCK OR ALLOW ---
    if (conflict) {
      return res.status(400).json({ message: "This room is already booked for this time." });
    }

    // If no conflict, create and save the document
    const newBooking = new Room({ roomId, userEmail, startTime, endTime, roomType });
    await newBooking.save();

    res.status(201).json({ message: "Booking successful!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

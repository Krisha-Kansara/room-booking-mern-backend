const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId:{
        type : Number,
        required : true,
        trim : true
    },
    userEmail: {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique: true
    },
   startTime: { 
    type: Date, // Changed to Date type for proper comparison
    required: true,
    validate: {
      validator: function(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return value >= today;
      },
      message: 'Booking date cannot be in the past.'
    }
  },
  endTime: { 
    type: Date, // Changed to Date type
    required: true,
    validate: {
      validator: function(value) {
        // Validation passes only if endTime comes after startTime
        return value > this.startTime;
      },
      message: 'End time must be after the start time.'
    }
  },
    roomType : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Room', roomSchema);
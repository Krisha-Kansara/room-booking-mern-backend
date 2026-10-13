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
        trim : true
    },
    startTime : {
        type : String,
        required : true,
    },
    endTime : {
        type : String,
        required : true
    },
    roomType : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Room', roomSchema);
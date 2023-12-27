const mongoose = require('mongoose');

const eventScheme = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number
    },
    capacity:{
        type: Number
    },
    availability:{
        type: Boolean,
        default: true
    },
    property:{
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('Event', eventScheme);
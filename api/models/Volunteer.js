// models/Volunteer.js
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  userid: {  type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  skills: { type: String, required: true },
  date: { type: Date, default: Date.now },
  paymentHistory: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model('Volunteer', volunteerSchema);

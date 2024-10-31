const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
   eventid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event'
  },
  userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
  },
   ticketDetails: {
      name: { type: String, required: true },
      email: { type: String, require: true },
      eventname: { type: String, require: true },
      eventdate: { type: Date, require: true },
      eventtime: { type: String, require: true },
      ticketprice: { type: Number, require: true },
      qr: { type: String, require: true },
   },
   count: { type: Number, default: 0 },
});

const TicketModel = mongoose.model(`Ticket`, ticketSchema);
module.exports = TicketModel;

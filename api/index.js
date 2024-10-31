const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const Feedback=require("./models/Feedback");
const Ticket = require("./models/Ticket");
const Volunteer = require("./models/Volunteer");

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:5173",
   })
);

mongoose.connect(process.env.MONGO_URL);
app.use(cors({ origin: 'http://localhost:5173' }));  // replace with your frontend URL

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + "-" + file.originalname);
   },
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));
app.get("/test", (req, res) => {
   res.json("test ok");
});

app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
   } catch (e) {
      res.status(422).json(e);
   }
});

app.post("/login", async (req, res) => {
   const { email, password } = req.body;

   const userDoc = await UserModel.findOne({ email });

   if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
   }

   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
   }

   jwt.sign(
      {
         email: userDoc.email,
         id: userDoc._id,
      },
      jwtSecret,
      {},
      (err, token) => {
         if (err) {
            return res.status(500).json({ error: "Failed to generate token" });
         }
         res.cookie("token", token).json(userDoc);
      }
   );
});

app.get("/profile", (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) throw err;
         const { name, email, _id } = await UserModel.findById(userData.id);
         res.json({ name, email, _id });
      });
   } else {
      res.json(null);
   }
});

app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});

const eventSchema = new mongoose.Schema({
   owner: String,
   title: String,
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   booth: Number,
   category: String,
   Participants: Number,
   Count: Number,
   Income: Number,
   ticketPrice: Number,
   Quantity: Number,
   image: String,
   likes: Number,
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

app.post("/createEvent", upload.single("image"), async (req, res) => {
   try {
      const eventData = req.body;
      eventData.image = req.file ? req.file.path : "";
      const newEvent = new Event(eventData);
      await newEvent.save();
      res.status(201).json(newEvent);
   } catch (error) {
      res.status(500).json({ error: "Failed to save the event to MongoDB" });
   }
});

app.get("/createEvent/:userId?", async (req, res) => {
   try {
       const { userId } = req.params;
       if (!userId) {
         const allFutureEvents = await Event.find({
             eventDate: { $gt: new Date() }  // Only future events
         });
         return res.json(allFutureEvents);
     }
       // Find categories where the user rated an event above a threshold (e.g., 3)
       const feedbackEntries = await Feedback.find({
         userId: userId,
         rating: { $gt: 3 }
       }); // Only select eventId field
     // Extract eventIds into an array
     const eventIds = feedbackEntries.map(entry => entry.eventId);

     // Step 2: Fetch categories from Event using the obtained eventIds
     const events = await Event.find({
         _id: { $in: eventIds } // Find events with these eventIds
     }).select('category'); // Only select category field

     // Extract categories into an array
     const categories = events.map(event => event.category);
       // Fetch all events in the preferred categories
       const preferredEvents = await Event.find({ category: { $in: categories },
         eventDate: { $gt: new Date() } });

       // Fetch all other events not in the preferred categories
       const otherEvents = await Event.find({ category: { $nin: categories },
         eventDate: { $gt: new Date() } });
       // Combine preferred events (displayed first) and other events
       const event = [...preferredEvents, ...otherEvents];
       res.json(event);
   } catch (error) {
       res.status(500).json({ message: "Error fetching events", error });
   }
});


app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }

         event.likes += 1;
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error liking the event:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/events", (req, res) => {
   Event.find()
      .then((events) => {
         res.json(events);
      })
      .catch((error) => {
         console.error("Error fetching events:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});
app.get('/api/boothAvailability', async (req, res) => {
   try {
      const today = new Date();
    
      // Retrieve only future events, selecting booth and eventName fields
      const futureEvents = await Event.find(
        { eventDate: { $gte: today } },  // Filters events with dates in the future
        'booth title'
      );
     const boothData = futureEvents.map(event => ({
       booth: event.booth,
       title: event.title
     }));
     res.json(boothData);
   } catch (error) {
     console.error('Error fetching booth data:', error);
     res.status(500).send('Error retrieving booth data');
   }
 });
app.get('/api/booth/available-booths', async (req, res) => {
   try {
       // Find all booked booth numbers (those already associated with an event)
       const today = new Date();
       const bookedBooths = await Event.find( { eventDate: { $gte: today } }, 'booth').distinct('booth'); // Get unique booked booth numbers

       // Define all booth numbers from 1 to 30
       const totalBooths = Array.from({ length: 30 }, (_, i) => i + 1);

       // Filter out booked booths to get available ones
       const availableBooths = totalBooths.filter(booth => !bookedBooths.includes(booth));

       res.json(availableBooths); // Send the available booth numbers as response
   } catch (error) {
       console.error('Error fetching available booths:', error);
       res.status(500).json({ message: 'Server error' });
   }
});

app.post("/tickets", async (req, res) => {
   try {
      const ticketDetails = req.body;
      const newTicket = new Ticket(ticketDetails);
      await newTicket.save();
      return res.status(201).json({ ticket: newTicket });
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});

app.get("/tickets/:id", async (req, res) => {
   try {
      const tickets = await Ticket.find();
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});

app.get("/tickets/user/:userId", (req, res) => {
   const userId = req.params.userId;

   Ticket.find({ userid: userId })
      .then((tickets) => {
         res.json(tickets);
      })
      .catch((error) => {
         console.error("Error fetching user tickets:", error);
         res.status(500).json({ error: "Failed to fetch user tickets" });
      });
});

app.delete("/tickets/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      await Ticket.findByIdAndDelete(ticketId);
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});
// Route to fetch completed events for the user
app.get('/api/completed-events/:userId',  async (req, res) => {
   const userId = req.params.userId; // Get the user ID from the authenticated user
   const today = new Date();

   try {
     
       // Query to find tickets that the user has purchased for past events
       const completedEvents = await Ticket.find({
           userid: userId, // Check for the user's ID in the ticket collection
           'ticketDetails.eventdate': { $lt: today }, // Ensure the event date is before today
       }).lean();
       const eventIds = completedEvents.map(ticket => ticket.eventid);

// Find events where feedback does not exist for the same event and user
const feedbacks = await Feedback.find({
    userId: userId,
    eventId: { $in: eventIds }
});

const feedbackEventIds = feedbacks.map(feedback => feedback.eventId.toString());

// Filter out events that already have feedback
const eventsWithoutFeedback = completedEvents.filter(ticket => !feedbackEventIds.includes(ticket.eventid.toString()));
      
       if (eventsWithoutFeedback.length === 0) {
         return res.status(404).json({ message: 'No completed events found' });
     }
       res.json(eventsWithoutFeedback); // Send back the completed events
   } catch (err) {
       res.status(500).json({ message: 'Error fetching completed events' });
   }
});
app.post('/api/submit-feedback/:userId', async (req, res) => {
   const { eventId, rating, comments } = req.body;
   const userId = req.params.userId;
 

   try {
       // Add feedback to the database
       const feedback = new Feedback({
           eventId: eventId,
           userId: userId,
           rating,
           comments
       });
       await feedback.save();

       res.status(200).json({ message: 'Feedback submitted successfully' });
   } catch (err) {
      console.log(err.message);
       res.status(500).json({ message: 'Error submitting feedback' });
       
   }
});

app.post('/api/volunteers-submit/:userId', async (req, res) => {
   const volunteer = req.body;
   const userId = req.params.userId;
 

   try {
       // Add feedback to the database
       const volunteers = new Volunteer({
           userid: userId,
           name:volunteer.name,
           email:volunteer.email,
           phone:volunteer.phone,
           skills:volunteer.skills
       });
       await volunteers.save();

       res.status(200).json({ message: 'Form Submitted successfully' });
   } catch (err) {
      console.log(err.message);
       res.status(500).json({ message: 'Error submitting feedback' });
       
   }
});
app.get('/api/volunteer/is-registered/:userId', async (req, res) => {
   try {
       const userId = req.params.userId;
       const isRegistered = await Volunteer.findOne({ userid: userId });
       if (isRegistered) {
           return res.json({ registered: true });
       }
       res.json({ registered: false });
   } catch (error) {
       console.error('Error checking volunteer registration:', error);
       res.status(500).json({ message: 'Server error' });
   }
});
app.get('/api/admin/events', async (req, res) => {
   try {
     const events = await Event.find(); // Fetch all events from the database
     res.json(events);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });
 app.put('/api/admin/events/:id', async (req, res) => {
   try {
     const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
     res.json(event);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 });
 app.delete('/api/admin/events/:eventId', async (req, res) => {
   const { eventId } = req.params;
 
   try {
     const result = await Event.findByIdAndDelete(eventId);
     
     // Check if the event was found and deleted
     if (!result) {
       return res.status(404).json({ message: 'Event not found' });
     }
 
     res.status(200).json({ message: 'Event deleted successfully' });
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Server error' });
   }
 });
 app.get('/api/feedback/all-feedback', async (req, res) => {
   try {
       const feedbacks = await Feedback.find()
           .populate('eventId', 'title') // Populate event details (assuming 'name' field in Event)
           .populate('userId', 'name'); // Populate user details (assuming 'username' field in User)
       
       res.status(200).json(feedbacks);
   } catch (error) {
       res.status(500).json({ error: 'Failed to fetch feedback.' });
   }
});
app.get('/api/volunteers/all-volunteers', async (req, res) => {
   try {
       const volunteers = await Volunteer.find();
       res.status(200).json(volunteers);
   } catch (error) {
       res.status(500).json({ error: 'Failed to fetch volunteers' });
   }
});

app.post('/api/volunteers/pay-volunteer/:id', async (req, res) => {
   try {
       const volunteerId = req.params.id;

       res.status(200).json({ message: `Payment successful for volunteer ID: ${volunteerId}` });
   } catch (error) {
       res.status(500).json({ error: 'Failed to process payment' });
   }
});
app.post('/volunteer/:id/payment', async (req, res) => {
   const { id } = req.params;
   const { paymentDetails } = req.body;
   try {
     const volunteer = await Volunteer.findById(id);
     if (!volunteer) {
       return res.status(404).json({ message: 'Volunteer not found' });
     }
 
     // Add payment to paymentHistory
     volunteer.paymentHistory.push({
       amount: paymentDetails.amount,
       date: new Date()
     });
     await volunteer.save();
     res.status(200).json({ message: 'Payment recorded successfully' });
   } catch (error) {
      console.log(error);
     res.status(500).json({ message: 'Error processing payment', error });
   }
 });
 app.get('/volunteer/:id', async (req, res) => {
   const { id } = req.params;
 
   try {
     const volunteer = await Volunteer.findById(id); // Find the volunteer by ID in the database
 
     if (!volunteer) {
       return res.status(404).json({ message: 'Volunteer not found' });
     }
 
     res.json(volunteer); // Send the volunteer data as JSON response
   } catch (error) {
     console.error('Error fetching volunteer:', error);
     res.status(500).json({ message: 'Server error' });
   }
 });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

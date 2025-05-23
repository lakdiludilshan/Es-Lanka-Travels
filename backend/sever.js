const dotenv = require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Routes
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const placeRoute = require('./routes/placeRoute');
const commentRoute = require('./routes/commentRoute');
const feedbackRoute = require('./routes/feedbackRoute');
const preferenceRoute = require('./routes/preferenceRoute');
const hotelRoutes = require('./routes/hotelRoute');
const reviewRoutes = require('./routes/reviewRoute');

// ML model bridge
const PythonMLBridge = require('./ml/model_bridge');
const mlBridge = new PythonMLBridge();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true,
}));

// Route middleware
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/places", placeRoute);
app.use("/api/feedbacks", feedbackRoute);
app.use("/api/preferences", preferenceRoute);
app.use("/api/hotels", hotelRoutes);
app.use("/api/reviews", reviewRoutes);

// Test route
app.get("/", (req, res ) => {
    res.send("home page");
});

// New: Tour plan generation route
app.post('/api/generate-tour-plan', async (req, res) => {
  try {
    const { tripStyles, activities, budget, duration, travelers, transport, accommodation } = req.body;
    console.log('Received request:', { tripStyles, activities, budget, duration, travelers, transport, accommodation });

    if (!tripStyles || !activities || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (duration < 3) {
      return res.status(400).json({ error: 'Tour must be at least 3 days' });
    }
    if (duration > 11) {
      return res.status(400).json({ error: 'Please enter less than 12 days' });
    }

    const tourPlan = await mlBridge.generateTourPlan(
      [...tripStyles, ...activities],
      parseInt(duration),
      budget,
      parseInt(travelers) || 2,
      transport
    );

    const accommodationPrice = accommodation === "Homestay" ? 50 :
                               accommodation === "Beach Resort" ? (budget === "Luxury" ? 300 : 150) :
                               accommodation === "Eco-Lodge" ? 120 :
                               (budget === "Luxury" ? 250 : 150);

    const transportPrice = transport === "Private Car" ? (budget === "Luxury" ? 100 : 80) :
                          transport === "Train" ? (budget === "Mid-range" ? 30 : 20) :
                          transport === "Tuk-tuk" ? 40 :
                          200;

    const activityBasePrice = budget === "Luxury" ? 100 :
                             budget === "Mid-range" ? 50 :
                             25;

    const foodPricePerDay = budget === "Luxury" ? 50 :
                           budget === "Mid-range" ? 30 :
                           15;

    const totalDays = tourPlan.dailyItinerary.length;
    const totalActivities = tourPlan.dailyItinerary.reduce((sum, day) => sum + day.activities.length, 0);

    const totalBudget = {
      accommodation: accommodationPrice * totalDays,
      transportation: transportPrice * totalDays,
      activities: activityBasePrice * totalActivities,
      food: foodPricePerDay * totalDays * (parseInt(travelers) || 2)
    };

    tourPlan.accommodation = [{
      name: accommodation,
      details: accommodation === "Homestay" ? "Experience local hospitality in a family home" :
              accommodation === "Beach Resort" ? "Luxurious stay with beachfront access" :
              accommodation === "Eco-Lodge" ? "Sustainable accommodation in natural surroundings" :
              "Unique and personalized hotel experience",
      price: accommodationPrice
    }];

    tourPlan.transportation = [{
      type: transport,
      details: transport === "Private Car" ? "Comfortable car with professional driver" :
              transport === "Train" ? "Scenic train journey" :
              transport === "Tuk-tuk" ? "Local three-wheeler" :
              "Quick and convenient air travel",
      price: transportPrice
    }];

    tourPlan.budget = totalBudget;

    console.log('Successfully generated tour plan');
    res.json(tourPlan);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

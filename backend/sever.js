const dotenv = require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const placeRoute = require('./routes/placeRoute');
const commentRoute = require('./routes/commentRoute');
const feedbackRoute = require('./routes/feedbackRoute');
const preferenceRoute = require('./routes/preferenceRoute');
const hotelRoutes = require('./routes/hotelRoute');
const cookieParser = require('cookie-parser');

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true,
}))

//route middleware
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/places", placeRoute);
app.use("/api/feedbacks", feedbackRoute);
app.use("/api/preferences", preferenceRoute);
app.use("/api/hotels", hotelRoutes);

// routes
app.get("/", (req, res ) => {
    res.send("home page");
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
// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes'); // Import routes

dotenv.config();


// const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(error => console.log("MongoDB connection error:", error));

app.use(express.json());

// Use product routes
app.use('/api/products', productRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

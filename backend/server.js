const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/dbConfig');

// Import routes
const categoryRoutes = require('./routes/categoryRoutes');
const RegisterRoutes = require('./routes/registerRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const productRoutes = require('./routes/productRoutes');


// Validate environment variables
if (!process.env.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SQA Backend API' });
});

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/register', RegisterRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/products', productRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

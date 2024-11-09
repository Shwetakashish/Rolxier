
// routes/// routes/productRoutes.js
const express = require('express');

const { initializeDb, getTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData } = require('../controllers/productController');

const router = express.Router();

// Route for initializing the database
router.post('/initialize-db', initializeDb); // POST route
// routes/productRoutes.js
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined-data', getCombinedData);

module.exports = router;



// controllers/productController.js
const axios = require('axios');
const Product = require('../models/Product');

const initializeDb = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        await Product.insertMany(data);
        res.status(201).send('Database initialized with seed data');
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
};


// controllers/productController.js
const getTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const query = {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: parseFloat(search) || null }
        ]
    };

    try {
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// controllers/productController.js
const getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth();

    try {
        const transactions = await Product.aggregate([
            { $match: { dateOfSale: { $exists: true }, $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex + 1] } } },
            { $group: {
                _id: null,
                totalSales: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
                soldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
                notSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
            }},
        ]);

        res.json(transactions[0] || { totalSales: 0, soldItems: 0, notSoldItems: 0 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// controllers/productController.js
// controllers/productController.js

const getBarChartData = async (req, res) => {
  const { month } = req.query;
  const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth(); // Convert month to number (0 for January, etc.)

  try {
    const priceRanges = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $exists: true }, // Ensure we only match documents with dateOfSale
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthIndex + 1], // Match documents from the selected month
          },
        },
      },
      {
        $bucket: {
          groupBy: "$price", // Group by price
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], // Define the price ranges
          default: "901-above", // Define any price above 900 as the default
          output: { count: { $sum: 1 } }, // Count the number of items in each range
        },
      },
    ]);

    res.json(priceRanges); // Return the aggregated data as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bar chart data" });
  }
};


// controllers/productController.js
// controllers/productController.js
const getPieChartData = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth();

    try {
        const categories = await Product.aggregate([
            { $match: { dateOfSale: { $exists: true }, $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex + 1] } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        res.json(categories.map(category => ({ category: category._id, count: category.count })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
};



// controllers/productController.js
const getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            getStatistics(req, res),
            getBarChartData(req, res),
            getPieChartData(req, res),
        ]);

        res.json({ statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
};

module.exports = {
    initializeDb,
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
};

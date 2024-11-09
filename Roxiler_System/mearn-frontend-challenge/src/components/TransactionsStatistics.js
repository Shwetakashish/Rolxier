// src/components/TransactionsStatistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsStatistics = ({ month }) => {
    const [statistics, setStatistics] = useState({ totalSales: 0, soldItems: 0, notSoldItems: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/statistics`, { params: { month } });
                setStatistics(response.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };
        fetchStatistics();
    }, [month]);

    return (
        <div>
            <h2>Transactions Statistics</h2>
            <p>Total Sales: ${statistics.totalSales}</p>
            <p>Sold Items: {statistics.soldItems}</p>
            <p>Not Sold Items: {statistics.notSoldItems}</p>
        </div>
    );
};

export default TransactionsStatistics;

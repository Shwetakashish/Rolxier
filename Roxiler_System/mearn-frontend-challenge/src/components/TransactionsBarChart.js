// src/components/TransactionsBarChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

const TransactionsBarChart = ({ month }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/barchart`, { params: { month } });
                const priceRanges = response.data;

                setChartData({
                    labels: Object.keys(priceRanges),
                    datasets: [{
                        label: 'Number of Items',
                        data: Object.values(priceRanges),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    }]
                });
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };
        fetchChartData();
    }, [month]);

    return (
        <div>
            <h2>Transactions Bar Chart</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default TransactionsBarChart;

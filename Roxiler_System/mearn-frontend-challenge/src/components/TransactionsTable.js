// src/components/TransactionsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionsTable.css'; // Import the CSS file

const TransactionsTable = ({ month, searchTerm }) => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/transactions`, {
                    params: { page, perPage: 10, month, search: searchTerm },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchTransactions();
    }, [month, searchTerm, page]);

    return (
        <div className="table-container">
            <h1 className="dashboard-title">Transaction Dashboard</h1>
            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search transaction"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => e.target.value}
                />
                <select className="month-select" value={month} onChange={(e) => e.target.value}>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction._id}</td>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.sold ? 'Yes' : 'No'}</td>
                            <td><img src={transaction.image} alt={transaction.title} className="transaction-image" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <span>Page No: {page}</span>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <button onClick={() => setPage(page + 1)}>Next</button>
                <span>Per Page: 10</span>
            </div>
        </div>
    );
};

export default TransactionsTable;

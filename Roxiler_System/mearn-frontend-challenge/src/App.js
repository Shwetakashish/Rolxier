// src/App.js
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';

const App = () => {
    const [month, setMonth] = useState("March");
    const [searchTerm, setSearchTerm] = useState("");

    const handleMonthChange = (event) => setMonth(event.target.value);
    const handleSearchChange = (event) => setSearchTerm(event.target.value);

    return (
        <div>
            <h1>Transactions Dashboard</h1>
            <div>
                <label>Month: </label>
                <select value={month} onChange={handleMonthChange}>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            <input
                type="text"
                placeholder="Search Transactions"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <TransactionsTable month={month} searchTerm={searchTerm} />
            <TransactionsStatistics month={month} />
            <TransactionsBarChart month={month} />
        </div>
    );
};

export default App;

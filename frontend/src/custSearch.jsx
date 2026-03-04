import React, { useState, useEffect } from "react";
import './format.css';

function CustomerSearchPage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('customer_id');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/customer_search/search?query=${query}&type=${searchType}`)
      .then(res => res.json())
      .then(data => setCustomers(data));
  };

    const handleViewDetails = (customerId) => {
    fetch(`http://localhost:5000/customers/${customerId}`)
      .then(res => res.json())
      .then(data => setSelectedCustomer(data));
  }; 

  return (
    <div className="centered">
      <h1>Search Customers</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="customer_id">Customer ID</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
        </select>
        <button type="submit">Search</button>
      </form>

      <div className="film-list">
        {customers.map((customers) => (
          <div className="film-card" key={customers.customer_id}>
            <h3>{customers.first_name} {customers.last_name}</h3>
            <p>Status: {customers.active === 1 ? "Active" : "Inactive"}</p>
            <button onClick={() => handleViewDetails(customers.customer_id)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#484848', color: 'white', padding: '30px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', borderRadius: '10px' }}>
            <h2>{selectedCustomer.first_name} {selectedCustomer.last_name}</h2>
            <p><strong>Store:</strong> {selectedCustomer.store_id}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Address:</strong> {selectedCustomer.address_id}</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={handleRentClick} style={{ marginRight: '10px' }}>Rent Film</button>
              <button onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerSearchPage;
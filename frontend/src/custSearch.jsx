import React, { useState, useEffect } from "react";
import './format.css';

function CustomerSearchPage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('customer_id');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerRentals, setCustomerRentals] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/customer_search/search?query=${query}&type=${searchType}`)
      .then(res => res.json())
      .then(data => setCustomers(data));
  };

    const handleViewDetails = (customer_id) => {
    fetch(`http://localhost:5000/customer_search/${customer_id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedCustomer(data);
        setCustomerRentals(data.rentals || []);
    })
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
            <p>Customer ID: {customers.customer_id}</p>
            <p>Status: {customers.active === 1 ? "Active" : "Inactive"}</p>
            <button onClick={() => handleViewDetails(customers.customer_id)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#484848', color: 'white', padding: '30px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', borderRadius: '10px' }}>
            <h2>{selectedCustomer.first_name} {selectedCustomer.last_name}</h2>
            <p>Status: {selectedCustomer.active === 1 ? "Active" : "Inactive"}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            {customerRentals.length === 0 ? (<p>No past rentals.</p>) : (
                <ul>
                    {customerRentals.map(r => (
                        <li key={r.film_id}>
                            {r.title} - Rented: {new Date(r.rental_date).toLocaleDateString()} | Returned: {r.return_date ? new Date(r.return_date).toLocaleDateString() : "Not returned yet"}
                        </li>
                    ))}
                </ul>
            )}
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
            </div>
          </div>
      )}
    </div>
  );
}

export default CustomerSearchPage;
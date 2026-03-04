import React, { useState, useEffect } from "react";
import './format.css';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const fetchCustomers = (pageNum) => {
    setLoading(true);
    fetch(`http://localhost:5000/customers/list?page=${pageNum}&per_page=20`)
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers);
        setTotalPages(data.total_pages);
        setLoading(false);
      });
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) {
    return <div className="centered"><h2>Loading customers...</h2></div>;
  }

  return (
    <div className="centered">
      <h1>Customers</h1>
      
      <table style={{ width: '100%', maxWidth: '900px', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>First Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Last Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id} style={{ borderBottom: '1px solid #555' }}>
              <td style={{ padding: '10px' }}>{customer.customer_id}</td>
              <td style={{ padding: '10px' }}>{customer.first_name}</td>
              <td style={{ padding: '10px' }}>{customer.last_name}</td>
              <td style={{ padding: '10px' }}>{customer.email}</td>
              <td style={{ padding: '10px' }}>{customer.active ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default CustomersPage;

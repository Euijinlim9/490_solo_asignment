import React, { useState, useEffect } from "react";
import './format.css';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

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

  const handleAddCustomer = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/customers/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setShowAddForm(false);
        setNewCustomer({ first_name: '', last_name: '', email: '' });
        fetchCustomers(page);
      });
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setShowEditForm(true);
  };

  const handleEditCustomer = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/customers/update/${editingCustomer.customer_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: editingCustomer.first_name,
        last_name: editingCustomer.last_name,
        email: editingCustomer.email
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setShowEditForm(false);
        setEditingCustomer(null);
        fetchCustomers(page);
      });
  };

  if (loading) {
    return <div className="centered"><h2>Loading customers...</h2></div>;
  }

  return (
    <div className="centered">
      <h1>Customers</h1>
      
      <button onClick={() => setShowAddForm(true)} style={{ marginBottom: '20px', padding: '10px 20px' }}>Add New Customer</button>
      
      <table style={{ width: '100%', maxWidth: '900px', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>First Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Last Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
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
              <td style={{ padding: '10px' }}>
                <button onClick={() => handleEditClick(customer)} style={{ marginRight: '5px' }}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
      </div>

      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#484848', color: 'white', padding: '30px', minWidth: '400px', borderRadius: '10px' }}>
            <h2>Add New Customer</h2>
            <form onSubmit={handleAddCustomer}>
              <div style={{ marginBottom: '15px' }}>
                <label>First Name:</label>
                <input
                  type="text"
                  value={newCustomer.first_name}
                  onChange={(e) => setNewCustomer({...newCustomer, first_name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', color: 'white', background: '#333' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Last Name:</label>
                <input
                  type="text"
                  value={newCustomer.last_name}
                  onChange={(e) => setNewCustomer({...newCustomer, last_name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', color: 'white', background: '#333' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Email:</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', color: 'white', background: '#333' }}
                />
              </div>
              <button type="submit" style={{ marginRight: '10px' }}>Add Customer</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#484848', color: 'white', padding: '30px', minWidth: '400px', borderRadius: '10px' }}>
            <h2>Edit Customer</h2>
            <form onSubmit={handleEditCustomer}>
              <div style={{ marginBottom: '15px' }}>
                <label>First Name:</label>
                <input
                  type="text"
                  value={editingCustomer.first_name}
                  onChange={(e) => setEditingCustomer({...editingCustomer, first_name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', color: 'white', background: '#333' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Last Name:</label>
                <input
                  type="text"
                  value={editingCustomer.last_name}
                  onChange={(e) => setEditingCustomer({...editingCustomer, last_name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', color: 'white', background: '#333' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Email:</label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', color: 'white', background: '#333' }}
                />
              </div>
              <button type="submit" style={{ marginRight: '10px' }}>Update Customer</button>
              <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersPage;

import React, { useState, useEffect } from "react";
import './format.css';

function FilmsSearchPage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('film');
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/films/search?query=${query}&type=${searchType}`)
      .then(res => res.json())
      .then(data => setFilms(data));
  };

  const handleViewDetails = (filmId) => {
    fetch(`http://localhost:5000/topfilms/${filmId}`)
      .then(res => res.json())
      .then(data => {
        const film = data[0];
        const filmWithCopies = films.find(f => f.film_id === filmId);
        film.available_copies = filmWithCopies ? filmWithCopies.available_copies : 0;
        setSelectedFilm(film);
      });
  };

  const handleRentClick = () => {
    setShowRentalForm(true);
    setCustomerSearch('');
    setSelectedCustomer('');
    setFilteredCustomers([]);
    fetch('http://localhost:5000/customers')
      .then(res => res.json())
      .then(data => setCustomers(data));
  };

  const handleCustomerSearch = (e) => {
    const search = e.target.value;
    setCustomerSearch(search);
    if (search.trim() === '') {
      setFilteredCustomers([]);
      return;
    }
    const filtered = customers.filter(c => 
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_id.toString().includes(search)
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.customer_id);
    setCustomerSearch(`${customer.first_name} ${customer.last_name} (ID: ${customer.customer_id})`);
    setFilteredCustomers([]);
  };

  const handleCustomerFocus = () => {
    if (customerSearch.trim() !== '') {
      handleCustomerSearch({ target: { value: customerSearch } });
    }
  };

  const handleRentalSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFilm.available_copies === 0) {
      alert('No copies available to rent for this film.');
      return;
    }
    
    fetch('http://localhost:5000/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        film_id: selectedFilm.film_id,
        customer_id: selectedCustomer
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message || 'Rental created!');
          setShowRentalForm(false);
          setSelectedFilm(null);
        }
      });
  };

  return (
    <div className="centered">
      <h1>Search Films</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="film">Film Name</option>
          <option value="actor">Actor Name</option>
          <option value="genre">Genre</option>
        </select>
        <button type="submit">Search</button>
      </form>

      <div className="film-list">
        {films.map((film) => (
          <div className="film-card" key={film.film_id}>
            <h3>{film.title}</h3>
            <p>Year: {film.release_year} | Rate: ${film.rental_rate}</p>
            <p><strong>Available: {film.available_copies} copies</strong></p>
            <button onClick={() => handleViewDetails(film.film_id)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedFilm && !showRentalForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#484848', color: 'white', padding: '30px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', borderRadius: '10px' }}>
            <h2>{selectedFilm.title}</h2>
            <p><strong>Description:</strong> {selectedFilm.description}</p>
            <p><strong>Release Year:</strong> {selectedFilm.release_year}</p>
            <p><strong>Rating:</strong> {selectedFilm.rating}</p>
            <p><strong>Length:</strong> {selectedFilm.length} minutes</p>
            <p><strong>Language:</strong> {selectedFilm.language}</p>
            <p><strong>Actors:</strong> {selectedFilm.actor?.map(a => `${a.first_name} ${a.last_name}`).join(', ')}</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={handleRentClick} style={{ marginRight: '10px' }}>Rent Film</button>
              <button onClick={() => setSelectedFilm(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showRentalForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#484848', color: 'white', padding: '30px', minWidth: '400px', borderRadius: '10px' }}>
            <h2>Rent Film</h2>
            <form onSubmit={handleRentalSubmit}>
              <div style={{ marginBottom: '15px', position: 'relative' }}>
                <label>Select Customer (by name or ID):</label>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={handleCustomerSearch}
                  onFocus={handleCustomerFocus}
                  placeholder="Type customer name or ID..."
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', color: 'white', background: '#333' }}
                />
                {filteredCustomers.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#333', border: '1px solid #555', maxHeight: '200px', overflow: 'auto', zIndex: 1000 }}>
                    {filteredCustomers.map(c => (
                      <div
                        key={c.customer_id}
                        onClick={() => handleCustomerSelect(c)}
                        style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #555' }}
                        onMouseEnter={(e) => e.target.style.background = '#555'}
                        onMouseLeave={(e) => e.target.style.background = '#333'}
                      >
                        {c.first_name} {c.last_name} (ID: {c.customer_id})
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" style={{ marginRight: '10px' }}>Submit</button>
              <button type="button" onClick={() => setShowRentalForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilmsSearchPage;

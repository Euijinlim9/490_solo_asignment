import React from "react";
import { Link } from "react-router-dom";
import './format.css'; // separate file for formatting the website

function Header() {
  return (
    <header className="site-header">
        <div className="header-container">
      <h2 className="site-title">
        <span style={{ color: 'blue' }}>Sakila</span>
        <span style={{ color: 'orange' }}>DB</span>
      </h2>
      <nav className="nav-buttons">
        <Link to="/"><button>Home</button></Link>
        <Link to="/topfilms"><button>Top 5 Films</button></Link>
        <Link to="/topactors"><button>Top 5 Actors</button></Link>
        <Link to="/films"><button>Search Films</button></Link>
      </nav>
      </div>
    </header>
  );
}

export default Header;
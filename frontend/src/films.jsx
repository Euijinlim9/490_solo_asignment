import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './format.css';

function FilmPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/topfilms") // where flask runs on 5000
      .then((res) => res.json())
      .then((data) => {
        setFilms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching films:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
  <div className="centered">
      <h2>Loading films...</h2>
  </div>
    );
  }
  if (films.length === 0) {  //covers edge case where if no films found in database, show error
    return (
    <div className="centered">
        <h2>No films found.</h2>
  </div>
    );
  }

  return (
    <div className="centered">
      <h1>Top 5 Films</h1>
      <div className="film-list">
      {films.map((film) => (
        <div className="film-card" key={film.film_id}>
          <h3>{film.title}</h3>
          <ViewButton film_id={film.film_id} />
        </div>
      ))}
    </div>
    </div>
  );
}


function ViewButton({ film_id }) {
  return (
    <Link to={`/topfilms/${film_id}`}>
      <button>View &gt;&gt;</button>
    </Link>
  );
}

export default FilmPage;
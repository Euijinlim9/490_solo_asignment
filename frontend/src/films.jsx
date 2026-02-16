import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FilmPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/topfilms") // make sure Flask runs on 5000
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

  if (loading) return <p>Loading films...</p>;

  if (films.length === 0) return <p>No films found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Top 5 Films</h1>

      {films.map((film) => (
        <div
          key={film.film_id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          <h3>{film.title}</h3>
          <ViewButton film_id={film.film_id} />
        </div>
      ))}
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
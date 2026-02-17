import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function FilmDetails() {
    const { film_id } = useParams();
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/topfilms/${film_id}`) // where flask runs on 5000
        .then((res) => res.json())
        .then((data) => {
            setFilms(data);
            setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching film details:", err);
        setLoading(false);
      });
  }, [film_id]);

  if (loading) return <p>Loading film details...</p>;

  if (films.length === 0) return <p>No information found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        {films[0]?.title}
      </h1>
      <h2>Film Information:</h2>
      <div style={{ lineHeight: "1.6" }}>
        {films.map((film) => (
          <div key={film.film_id}> {/* shows film title, description, release year, actor name, and language */}
            <p>Film Name: {film.title}</p>
            <p> Actors:{" "}

                {film.actor.map((a, index) => (
                <span key={index}>
                {a.first_name} {a.last_name}
                {index < film.actor.length - 1 ? ", " : ""}
                </span>
            ))}
            </p>
            <p>Description: {film.description}</p>
            <p>Release Year: {film.release_year}</p>
            <p>Language: {film.language}</p>
            <p>Move Duration: {film.length} minutes</p>
            <p>Rating: {film.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilmDetails;
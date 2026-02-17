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

    if (loading) {
    return (
  <div className="centered">
      <h2>Loading film detail...</h2>
  </div>
    );
  }
  if (films.length === 0) { //covers edge case where if no film detail found in database, show error
    return (
    <div className="centered">
        <h2>No information found.</h2>;
  </div>
    );
  }

  return (
    <div className="centered">
      <h1>{films[0]?.title}</h1>
      <h2>Film Information</h2>
      <div style={{ lineHeight: "1.6" }}>
        {films.map((film) => (
          <div key={film.film_id}> {/* shows film title, description, release year, actor name, rating, duration and language */}
            <p>Film Name: {film.title}</p>
            <p> Actors:{" "}

                {film.actor.map((a, index) => ( //loop through actors array
                <span key={index}>
                {a.first_name} {a.last_name}
                {index < film.actor.length - 1 ? ", " : ""} {/* add a comma if last index not reached, if last index add nothing*/}
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
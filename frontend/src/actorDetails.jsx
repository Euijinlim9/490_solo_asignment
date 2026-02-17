import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function ActorDetails() {
    const { actor_id } = useParams();
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/topactors/${actor_id}`) // where flask runs on 5000
        .then((res) => res.json())
        .then((data) => {
            setActors(data);
            setLoading(false);
      })
      .catch((err) => { // if error, loads it onto console and stops
        console.error("Error fetching actor details:", err);
        setLoading(false);
      });
  }, [actor_id]);

    if (loading) {
    return (
  <div className="centered">
      <h2>Loading actors details...</h2>
  </div>
    );
  }
  if (actors.length === 0) { //covers edge case where if no actor details found in database, show error
    return (
    <div className="centered">
        <h2>No information found.</h2>;
  </div>
    );
  }

  return (
    <div className="centered">
      <h1> {actors[0].first_name} {actors[0].last_name} </h1>
      <h2>Top 5 Films:</h2>
      <div style={{ lineHeight: "1.6" }}>
        {actors.map((film) => (
          <div key={film.film_id}>
            {film.title} (Rented: {film.rented})
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActorDetails;
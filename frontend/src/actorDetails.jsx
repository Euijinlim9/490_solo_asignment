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
      .catch((err) => {
        console.error("Error fetching actor details:", err);
        setLoading(false);
      });
  }, [actor_id]);

  if (loading) return <p>Loading actor details...</p>;

  if (actors.length === 0) return <p>No information found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        {actors[0].first_name} {actors[0].last_name}
      </h1>
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
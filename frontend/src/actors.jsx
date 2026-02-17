import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ActorPage() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/topactors") // where flask runs on 5000
      .then((res) => res.json())
      .then((data) => {
        setActors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching actors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
  <div className="centered">
      <h2>Loading actors...</h2>
  </div>
    );
  }
  if (actors.length === 0) { //covers edge case where if no actors found in database, show error
    return (
    <div className="centered">
        <h2>No actors found.</h2>;
  </div>
    );
  }

  return (
    <div className="centered">
      <h1>Top 5 Actors</h1>
      <div className="film-list">
      {actors.map((actors) => (
        <div className="film-card" key={actors.actor_id}>
          <h3>{actors.first_name} {actors.last_name}</h3>
          <ViewButton actor_id={actors.actor_id} />
        </div>
      ))}
    </div>
    </div>
  );
}


function ViewButton({ actor_id }) {
  return (
    <Link to={`/topactors/${actor_id}`}>
      <button>View &gt;&gt;</button>
    </Link>
  );
}

export default ActorPage;
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

  if (loading) return <p>Loading actors...</p>;

  if (actors.length === 0) return <p>No actors found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Top 5 Actors</h1>

      {actors.map((actors) => (
        <div
          key={actors.actor_id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          <h3>{actors.first_name} {actors.last_name}</h3>
          <ViewButton actor_id={actors.actor_id} />
        </div>
      ))}
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
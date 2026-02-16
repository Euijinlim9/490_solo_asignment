import React from "react";
import { Link } from "react-router-dom";

function HomePage(){
    return (
        <>
        <title> Sakila Films </title>
        <FilmButton />
        <ActorButton />
        <h1>Welcome to Sakila Films</h1>
        <p>The database website to view all your favorite films!</p>
        </> 
    );
}

function FilmButton(){
    return (
        <Link to="/topfilms">
        <button>Top 5 Films</button>
        </Link>
    );
}

function ActorButton(){
    return(
        <Link to="/topactors">
        <button>Top 5 Actors</button>
        </Link>
    );
}

export default HomePage;
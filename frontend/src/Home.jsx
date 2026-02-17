import React from "react";
import { Link } from "react-router-dom";
import './format.css';

function HomePage(){
    return (
        <>
        <title> Sakila Films </title>
        <div className="centered">
            <div>
                <h1>Welcome to Sakila Films</h1>
                <p>The database website to view all your favorite films!</p>
            </div>
        </div>
        </> 
    );
}

export default HomePage;
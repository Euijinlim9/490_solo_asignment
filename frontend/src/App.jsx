import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header";
import HomePage from "./Home";
import FilmPage from "./films";
import ActorPage from "./actors";
import ActorDetails from "./actorDetails";
import FilmDetails from "./filmDetails";
import FilmsSearchPage from "./filmsSearch";

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/topfilms" element={<FilmPage />} />
        <Route path="/topactors" element={<ActorPage />} />
        <Route path="/topactors/:actor_id" element={<ActorDetails />} />
        <Route path="/topfilms/:film_id" element={<FilmDetails />} />
        <Route path="/films" element={<FilmsSearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
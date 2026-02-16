import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import FilmPage from "./films";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/topfilms" element={<FilmPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
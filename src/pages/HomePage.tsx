import React from "react";
import UrlForm from "../components/UrlForm";
import "./HomePage.css"

const HomePage: React.FC = () => {
  return (
    <div className="home">
      <h1>URL Shortener</h1>
      <p>Enter a link below to generate a short URL.</p>
      <UrlForm />
    </div>
  );
};

export default HomePage;
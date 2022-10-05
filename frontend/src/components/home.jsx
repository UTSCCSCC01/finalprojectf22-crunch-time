import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return <div className="container mt-3 mb-3">
    <h1>Home Page</h1>
    <p>This is a test page.</p>
    <Link to="/example">Link to example route</Link>
  </div>;
}

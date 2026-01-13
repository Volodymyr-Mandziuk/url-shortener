import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <h2>Page not found</h2>
      <p style={{ margin: "1rem 0" }}>
        The short URL you are looking for does not exist.
      </p>
      <Link to="/" style={{ color: "#1976d2", textDecoration: "underline" }}>
        Go back to homepage
      </Link>
    </div>
  );
};

export default NotFound;

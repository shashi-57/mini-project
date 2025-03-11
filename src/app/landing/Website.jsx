import React from "react";
import "./Website.css";

function Website() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Personal Expense Tracker</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#login" className="login-btn">Login</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">Track Your Expenses Effortlessly</h1>
        <p className="hero-subtitle">
          Take control of your finances with the Personal Expense Tracker. Manage, track, and analyze your expenses with ease.
        </p>
        <a href="#Register" className="btn-hero">Get Started</a>
      </header>
    </div>
  );
}

export default Website;

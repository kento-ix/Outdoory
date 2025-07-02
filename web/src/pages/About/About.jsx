import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <main>
      <div className="first-content">
        <h2 className="one">one</h2>
        <h2 className="two">two</h2>
        <h2 className="three">three</h2>

        <p>
          This web application is designed for people who enjoy outdoor activities.<br/>
          It's a platform where you can find companions who share your interests, or join activities organized by others.<br/>
          Try something new even if you have no experience and build a richer lifestyle through exciting adventures.
        </p>

        <Link to="/" className="home-link">Back Home</Link>
      </div>

      <div className="second-content">
        <p className="introduction">Learn More About this Website</p>
      </div>
    </main>
  );
};

export default About;
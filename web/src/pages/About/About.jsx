import { Link } from 'react-router-dom';
import './About.css';
import findImage from "../../assets/about/find-friend.jpg";
import joinImage from "../../assets/about/join-event.jpg";
import shareImage from "../../assets/about/share-experience.jpg";
import swimBoy from "../../assets/about/swimming.png";
import runGirl from "../../assets/about/running.png";
import hikeBoy from "../../assets/about/hiking.png";

const About = () => {
  return (
    <main>
      <div className="first-content">
        <img src={runGirl} alt="runnning girl" className='one' />
        <img src={swimBoy} alt="swimming boy" className='two'/>
        <img src={hikeBoy} alt="hiking boy"  className='three'/>

        <p>
          This web application is designed for people who enjoy outdoor activities.<br/>
          It's a platform where you can find companions who share your interests, or join activities organized by others.<br/>
          Try something new even if you have no experience and build a richer lifestyle through exciting adventures.
        </p>

        <Link to="/" className="home-link">Back Home</Link>
      </div>

      <div className="second-content">
        <p className="introduction">Learn More About this Website</p>

        <div className="card find-card">
          <img src={findImage} alt="Find Friends" />
          <h3>🎯 Find Outdoor Companions</h3>
          <p>
            Connect with people who share your interests and enjoy outdoor adventures together.
          </p>
        </div>

        <div className="card join-card">
          <img src={joinImage} alt="Join Events" />
          <h3>📍 Join or Create Events</h3>
          <p>
            Host your own activity or join existing events to explore nature and meet like-minded people.
          </p>
        </div>

        <div className="card share-card">
          <img src={shareImage} alt="Share Experience" />
          <h3>🌄 Share Your Experience</h3>
          <p>
            Post your adventures and photos to inspire others and keep memories alive.
          </p>
        </div>
      </div>
    </main>
  );
};

export default About;
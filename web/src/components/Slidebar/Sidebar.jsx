import { Link } from "react-router-dom";
import "./Slidebar.css";
import { useState, useEffect, useRef } from "react";

const Sidebar = ({ onClose, onLogin, onSignin }) => {
  const [isActive, setIsActive] = useState(false);
  const sidebarRef = useRef(null);

  // open effect click menu icon
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 20);
    
    return () => clearTimeout(timer);
  }, []);
  
  // close effect click close icon
  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, onClose]);

  // close effect click outside slidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current && !sidebarRef.current.contains(e.target)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsActive(false);
  };

  const handleLinkClick = () => {
    handleClose();
  };

  return (
    <div
      className={`right-slide ${isActive ? "active" : ""}`}
      ref={sidebarRef}
    >
      <div className="slide-top">
        <button className="close-icon material-symbols-outlined" onClick={handleClose}>close</button>
        <Link to="/about" className="about" onClick={handleLinkClick}>About</Link>
        <Link to="/document" className="document" onClick={handleLinkClick}>Documentation</Link>
        <Link to="/mypage" className="mypage" onClick={handleLinkClick}>Mypage</Link>
        <button className="slide-event">Events</button>
        <button className="slide-experience">Experience</button>
      </div>
      <div className="slide-bottom">
        <button className="login-button" onClick={onLogin}>LogIn</button>
        <button className="signin-button" onClick={onSignin}>SignIn</button>
      </div>
    </div>
  );
};

export default Sidebar;

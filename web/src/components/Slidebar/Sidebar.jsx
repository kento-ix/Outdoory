import { Link } from "react-router-dom";
import "./Slidebar.css";
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { sidebarOpenAtom, modalModeAtom, viewModeAtom } from "../../atoms/uiAtoms";
import { authUserAtom, authTokenAtom, authErrorAtom } from "../../atoms/authAtoms";
import { logoutUser } from "../../arc/auth/authServices";


const Sidebar = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const [, setModalMode] = useAtom(modalModeAtom);

  const [isActive, setIsActive] = useState(false);
  const sidebarRef = useRef(null);

  const [, setAuthToken] = useAtom(authTokenAtom);
  const [, setAuthError] = useAtom(authErrorAtom);

  const [viewMode, setViewMode] = useAtom(viewModeAtom)


  // open sidebar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  // close sidebar
  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, setSidebarOpen]);

  // close click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
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

  const handleLogin = () => {
    setSidebarOpen(false);
    setModalMode("login");
  };

  const handleSignin = () => {
    setSidebarOpen(false);
    setModalMode("signin");
  };

  const handleLogout = async () => {
    const { ok, data } = await logoutUser();
    if (ok) {
      setAuthUser(null);
      setAuthToken(null);
      setSidebarOpen(false);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } else {
      setAuthError(data.error || "Logout failed");
    }
  };

  const handleEventsClick = () => {
    setViewMode("event");
    handleClose();
  };

  const handleExperienceClick = () => {
    setViewMode("experience");
    handleClose();
  };


  return (
    <div className={`right-slide ${isActive ? "active" : ""}`} ref={sidebarRef}>
      <div className="slide-top">
        <button className="close-icon material-symbols-outlined" onClick={handleClose}>close</button>
        <Link to="/about" className="about" onClick={handleLinkClick}>About</Link>
        <Link to="/document" className="document" onClick={handleLinkClick}>Documentation</Link>
        <Link to="/mypage" className="mypage" onClick={handleLinkClick}>Mypage</Link>
        <button className={`slide-event ${viewMode === "event" ? "active" : ""}`} onClick={handleEventsClick}>
          Events
        </button>
        <button className={`slide-experience ${viewMode === "experience" ? "active" : ""}`} onClick={handleExperienceClick}>
          Experience
        </button>
      </div>
      <div className="slide-bottom">
        {authUser ? (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button className="login-button" onClick={handleLogin}>LogIn</button>
            <button className="signin-button" onClick={handleSignin}>SignIn</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

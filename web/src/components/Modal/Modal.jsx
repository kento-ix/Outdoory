import React from "react";
import "./Modal.css";
import { useState, useEffect, useRef } from "react";

function Modal({ mode, onClose, onChangeMode }) {
  const [isActive, setIsActive] = useState(false);
  const modalRef = useRef(null);

  // open effect click menu icon
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 20);

    return () => clearTimeout(timer);
  }, []);

  // close effect click close icon
  useEffect(() => {
    if(!isActive) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, onClose]);

  // close effect click outside modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsActive(false);
  };

  return (
    <div className={`modal-overlay ${isActive ? "active" : ""}`}>
      <div className="modal-content" ref={modalRef}>
        {mode === "login" ? (
          <div className="login-modal">
            <h2>Login</h2>
            <button className="close-icon material-symbols-outlined" onClick={handleClose}>close</button>
            <form>
              <input type="text" placeholder="Username" />
              <input type="text" placeholder="Password" />
              <button className="auth-button" type="submit">Login</button>
            </form>
            <p>
              Do not have account?{" "} 
              <button type="button" className="change-modal" onClick={(e) => {
                e.preventDefault();
                onChangeMode("signin");
                }}>
                Signin
              </button>
            </p>
          </div>
        ) : (
          <div className="signin-modal">
            <h2>Signin</h2>
            <button className="close-icon material-symbols-outlined" onClick={handleClose}>close</button>
            <form>
              <input type="text" placeholder="Username" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className="auth-button" type="submit">SignIn</button>
            </form>
            <p>
              Already have an account?{" "}
              <button type="button" className="change-modal" onClick={(e) => {
                  e.preventDefault();
                onChangeMode("login");
              }}>
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;

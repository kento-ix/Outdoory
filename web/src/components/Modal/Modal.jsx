import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import { useAtom } from "jotai";
import { modalModeAtom } from "../../atoms/uiAtoms";

function Modal() {
  const [modalMode, setModalMode] = useAtom(modalModeAtom);
  const [isActive, setIsActive] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 20);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => setModalMode(null), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, setModalMode]);

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
        {modalMode === "login" ? (
          <div className="login-modal">
            <h2>Login</h2>
            <button className="close-icon material-symbols-outlined" onClick={handleClose}>close</button>
            <form>
              <input type="text" placeholder="Username" required minLength="3" autoComplete="off"/>
              <input type="password" placeholder="Password" required autoComplete="off"/>
              <button className="auth-button" type="submit">Login</button>
            </form>
            <p>
              Do not have account?{" "}
              <button
                type="button"
                className="change-modal"
                onClick={(e) => {
                  e.preventDefault();
                  setModalMode("signin");
                }}
              >
                Signin
              </button>
            </p>
          </div>
        ) : (
          <div className="signin-modal">
            <h2>Signin</h2>
            <button className="close-icon material-symbols-outlined" onClick={handleClose}>close</button>
            <form>
              <input type="text" placeholder="Username" required minLength="3" autoComplete="off"/>
              <input type="email" required placeholder="example@example.com" autoComplete="off"/>
              <input type="password" placeholder="Password" autoComplete="off"/>
              <button className="auth-button" type="submit">SignIn</button>
            </form>
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="change-modal"
                onClick={(e) => {
                  e.preventDefault();
                  setModalMode("login");
                }}
              >
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

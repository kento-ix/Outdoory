import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import { useAtom } from "jotai";
import { modalModeAtom } from "../../atoms/uiAtoms";
import { registerUser, loginUser } from "../../arc/auth/authServices";
import {
  authErrorAtom,
  authTokenAtom,
  authUserAtom,
} from "../../atoms/authAtoms";

function Modal() {
  const [modalMode, setModalMode] = useAtom(modalModeAtom);
  const [isActive, setIsActive] = useState(false);

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [authError, setAuthError] = useAtom(authErrorAtom);
  const [, setAuthUser] = useAtom(authUserAtom);
  const [, setAuthToken] = useAtom(authTokenAtom);

  const modalRef = useRef(null);

  // Modal animation
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setAuthError("");
    setRegisterSuccess(false);
    setLoginSuccess(false);
  }, [modalMode, setAuthError]);

  const handleClose = () => {
    setIsActive(false);
  };

  // register submit
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form[0].value;
    const email = form[1].value;
    const password = form[2].value;

    setAuthError("");
    setRegisterSuccess(false);

    const { ok, data } = await registerUser({ username, email, password });

    if (!ok) {
      setAuthError(data.errors || data.error || "Fail to register");
    } else {
      setRegisterSuccess(true);
    }
  };

  // login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form[0].value;
    const password = form[1].value;

    setAuthError("");
    setLoginSuccess(false);

    const { ok, data } = await loginUser({ username, password });

    if (!ok) {
      setAuthError(data.error || "Login failed");
    } else {
      setAuthUser(data.user);
      setAuthToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoginSuccess(true);
    }
  };

  return (
    <div className={`modal-overlay ${isActive ? "active" : ""}`}>
      <div className="modal-content" ref={modalRef}>
        {modalMode === "login" ? (
          <div className="login-modal">
            <h2>Login</h2>
            <button
              className="close-icon material-symbols-outlined"
              onClick={handleClose}
            >
              close
            </button>
            {loginSuccess ? (
              <div className="login-success">
                <p className="success-message">Login successful!</p>
                <button
                  className="change-modal"
                  onClick={() => {
                    setModalMode(null);
                    setLoginSuccess(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleLogin}>
                  <input type="text" placeholder="Username" required minLength="3" autoComplete="off" />
                  <input type="password" placeholder="Password" required autoComplete="off" />
                  <button className="auth-button" type="submit"> Login </button>
                  {authError && (
                    <p className="error-message">
                      {typeof authError === "string"
                        ? authError
                        : JSON.stringify(authError)}
                    </p>
                  )}
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
              </>
            )}
          </div>
        ) : (
          <div className="signin-modal">
            <h2>Signin</h2>
            <button
              className="close-icon material-symbols-outlined"
              onClick={handleClose}
            >
              close
            </button>
            {registerSuccess ? (
              <div className="register-success">
                <p className="success-message">Registration complete!</p>
                <button
                  className="change-modal"
                  onClick={() => setModalMode("login")}
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                <input type="text" placeholder="Username" required minLength="3" autoComplete="off" />
                <input type="email" required placeholder="example@example.com" autoComplete="off" />
                <input type="password" required placeholder="Password" autoComplete="off" />
                <button className="auth-button" type="submit"> SignIn </button>
                {authError && (
                  <p className="error-message">
                    {typeof authError === "string"
                      ? authError
                      : JSON.stringify(authError)}
                  </p>
                )}
              </form>
            )}
            {!registerSuccess && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;

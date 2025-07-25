import "./Header.css";
import "../Modal/Modal.css";

import Modal from "../Modal/Modal";
import Sidebar from "../Slidebar/Sidebar.jsx";
import { Link } from "react-router-dom";
import logo from "../../assets/logo2.png";
import { useAtom } from "jotai";
import { modalModeAtom, sidebarOpenAtom, viewModeAtom } from "../../atoms/uiAtoms";


const Header = () => {
  const [modalMode] = useAtom(modalModeAtom);
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  return (
    <header className="main-header">
      <div className="nav-left">
        <Link to="/"><img src={logo} alt="logo" /></Link>
      </div>

      <div className="middle">
        <div className="event-mode">
          <button 
            className={`event ${viewMode === "event" ? "active" : ""}`}
            onClick={() => setViewMode("event")}
          >
            Events
          </button>
        </div>

        <div className="experience-mode">
          <button 
            className={`experience ${viewMode === "experience" ? "active" : ""}`}
            onClick={() => setViewMode("experience")}
          > 
            Experience
          </button>
        </div>
      </div>

      <div className="nav-right">
        <button
          className="menu-icon material-symbols-outlined"
          onClick={() => setSidebarOpen(true)}
        >
          menu
        </button>
      </div>

      {modalMode && <Modal />}
      {sidebarOpen && <Sidebar />}
    </header>
  );
};

export default Header;
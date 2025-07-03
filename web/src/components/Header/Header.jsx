import "./Header.css";
import "../Modal/Modal.css";
import "../Slidebar/Slidebar.css";
import Modal from "../Modal/Modal";
import Sidebar from "../Slidebar/Sidebar.jsx";
import { Link } from "react-router-dom";
import logo from "../../assets/logo2.png";
import { useAtom } from "jotai";
import { modalModeAtom, sidebarOpenAtom } from "../../atoms/uiAtoms";

const Header = () => {
  const [modalMode] = useAtom(modalModeAtom);
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <header className="main-header">
      <div className="nav-left">
        <Link to="/"><img src={logo} alt="logo" /></Link>
      </div>

      <div className="middle">
        <div className="event-mode">
          <button className="event">Events</button>
        </div>

        <div className="experience-mode">
          <button className="experience">Experience</button>
        </div>

        <div className="filter">
          <button className="tune-icon material-symbols-outlined">tune</button>
          <span>filtre</span>
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
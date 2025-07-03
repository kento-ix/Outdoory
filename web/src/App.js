import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import Header from "./components/Header/Header";
import About from "./pages/About/About";
import Document from "./pages/Document/Document";
import Mypage from "./pages/Mypage/Mypage";
import Home from "./pages/Home/Home";
import { sidebarOpenAtom } from "./atoms/uiAtoms";

function App() {
  const location = useLocation();
  const setSidebarOpen = useSetAtom(sidebarOpenAtom);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location, setSidebarOpen]);

  const showHeader = location.pathname !== "/about";

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/document" element={<Document />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </div>
  );
}

export default App;

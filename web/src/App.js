
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import About from "./pages/About/About";
import Document from "./pages/Document/Document";
import Mypage from "./pages/Mypage/Mypage";
import Home from "./pages/Home/Home";


function App() {
  const location = useLocation();

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

import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Ean from "./components/pages/EAN";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/ean-scanner" Component={Ean} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

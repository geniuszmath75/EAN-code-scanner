import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [click, setClick] = useState(true);

  function handleClick() {
    setClick(!click);
  }

  function closeMobileMenu() {
    setClick(true);
  }
  return (
    <>
      <nav className="navbar">
        <div className="mobile-menu" onClick={handleClick}>
          {click ? <HiOutlineMenu className="hi-outline-menu"/> : <HiX className="hi-x"/>}
        </div>
        <ul className={click ? "nav-menu" : "nav-menu active"}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                <span className="nav-item-text">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/ean-scanner" className="nav-links" onClick={closeMobileMenu}>
                <span className="nav-item-text">EAN</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;

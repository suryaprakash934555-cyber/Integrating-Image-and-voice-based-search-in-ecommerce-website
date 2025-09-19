import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import Button from '../components/Button'
import './style.css'

function Header() {
  return (
    <header>
      <Navbar className='header'  variant="dark" expand="lg">
        <div className=" container d-flex justify-content-between align-items-center gap-5 w-100">
          <Navbar.Brand as={Link} to="/">MyApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
             <div className="d-block d-lg-none w-100">
                <Menu color="white" />
            </div>

            <div className="d-flex align-items-center gap-5 w-100">
              {/* Input Field */}
              <form className="flex-grow-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  style={{ minWidth: '250px' }}
                />
              </form>

              {/* Icons */}
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-mic-fill text-white fs-4"></i>
                <i className="bi bi-camera-video-fill text-white fs-4"></i>
              </div>
           <Button buttonname="Login"/>
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>
         <div className="d-none d-lg-block w-100">
                <Menu color="#00416A" />
        </div>
    </header>
  );
}

export default Header;
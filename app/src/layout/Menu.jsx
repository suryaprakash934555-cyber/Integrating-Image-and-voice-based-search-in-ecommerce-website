import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './style.css'

function Menu({color}) {
  return (
    <Navbar  variant="light" expand="lg" className=' d-flex align-items-center justify-content-center w-100'>
      <div >
          <Nav className="me-auto d-flex align-items-center justify-content-between gap-5" >
          <Nav.Link as={Link} to="/all" className='text-danger fw-bold'>
          <span className='fontsize ' style={{color:color}}>
              <i className="bi bi-menu-button-wide me-2 "></i>All
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/branded" className='fw-bold'>
            <span className='fontsize ' style={{color:color}}>
              <i className="bi bi-star-fill me-2 "></i>Branded
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/shirts" className='fw-bold'>
            <span className='fontsize' style={{color:color}}>
              <i className="bi bi-shirt me-2"></i>Shirts
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/pants" className='f-s fw-bold'>
            <span className='fontsize' style={{color:color}}>
              <i className="bi bi-sliders me-2"></i>Pants
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/offers" className='fw-bold'>
            <span className='fontsize' style={{color:color}}>
              <i className="bi bi-tags me-2"></i>Offers
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/contact" className='fw-bold'>
            <span className='fontsize' style={{color:color}}>
              <i className="bi bi-envelope me-2"></i>Contact
              </span>
            </Nav.Link>

           <Nav.Link as={Link} to="/contact" className="fw-bold">
           <span className='fontsize' style={{color:color}}>
              <i className="bi bi-megaphone-fill me-2"></i>New Releases
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/contact" className="fw-bold">
            <span className='fontsize' style={{color:color}}>
              <i className="bi bi-gift-fill me-2"></i>Gift Card
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/contact" className="fw-bold">
            <span className='fontsize' style={{color:color}}>
              <i className="bi bi-credit-card-2-front-fill me-2"></i>SmartPay
              </span>
            </Nav.Link>
          </Nav>
      </div>
    </Navbar>
  );
}

export default Menu;
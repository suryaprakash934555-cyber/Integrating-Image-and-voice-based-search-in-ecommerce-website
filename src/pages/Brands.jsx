import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './Brands.css';

function Brands() {
  const brands = [
    { id: 1, name: 'ebay' },
    { id: 2, name: 'amazon.com' },
    { id: 3, name: 'AJIO' },
    { id: 4, name: 'nike' },
    { id: 5, name: 'adidas' },
    { id: 6, name: 'zara' }
  ];

  return (
    <div className='brand'>
      <div className='container brand-inner'>
        <Row className="align-items-center h-100">
          {brands.map(brand => (
            <Col md={2} xs={4} key={brand.id} className="text-center brand-col">
              <div className="brand-item">
                <span className="brand-text">{brand.name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Brands;
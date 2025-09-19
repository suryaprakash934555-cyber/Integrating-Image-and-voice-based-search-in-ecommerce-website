import React from 'react'
import {Row,Col} from 'react-bootstrap'

function Brands() {
  return (
    <div className='brand '>
        <div className='container brand-inner '>
      <Row>
        <Col md={2} className='text-center '>
            ebay
        </Col>
         <Col md={2} className='text-center'>
            amazon.com
        </Col>
         <Col md={2} className='text-center'>
            AJIO
        </Col>
         <Col md={2} className='text-center'>
            ebay
        </Col>
         <Col md={2} className='text-center'>
            amazon.com
        </Col>
         <Col md={2} className='text-center'>
            AJIO
        </Col>
      </Row>
      </div>
    </div>
  )
}

export default Brands

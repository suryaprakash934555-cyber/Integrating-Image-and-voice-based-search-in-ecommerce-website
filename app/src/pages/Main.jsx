import React from 'react'
import Button from '../components/Button'
import Header from "../layout/Header"
import {Row,Col,Carousel} from 'react-bootstrap'
import Img1 from '../assets/img1.png'
import './style.css'
import Brands from './Brands'
import Products from './Products'
import Footer from '../layout/Footer'

function Main() {
  return (
    <div>
      <Header/>

      <div className='main-container my-2'>
        <div className='main-inner'>
      <div className='container pt-5'>
     <Row className='gap-5'>
      <Col md={5}>
        <Row className='gap-4'>
          <Col md={12}>
          <h1 className='font'>Find Your Best Product With Us</h1>
          </Col>
          <Col md={12}>
          <p className='text-info fs-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Aut hic inventore officia porro cupiditate qui laborum nesciunt fuga ducimus 
            quia error sapiente, totam ab sed earum cum maxime. Magnam, iste?
          </p>
          </Col>
          <Col md={4}>
            <Button buttonname="Explore"  />
          </Col>
          </Row>
      </Col>
      <Col md={6}>
          <Row>
            <Col md={3} className='d-none d-lg-block '>
              <h1 className='fonts'>ULTIMATE</h1>
            </Col>
            <Col md={9}>
                 <Carousel>
      <Carousel.Item>
        <Row>
          <Col md={10}>
        <img
          className="d-block w-100 img-h"
          src={Img1}
          alt="First slide"
        />
        </Col>
        </Row>
      </Carousel.Item>

      <Carousel.Item>
         <Row>
          <Col md={10}>
        <img
          className="d-block w-100 img-h"
          src={Img1}
          alt="First slide"
        />
        </Col>
        </Row>
      </Carousel.Item>
    </Carousel>

            </Col>
          </Row>
      </Col>
     </Row>
     </div>
     </div>
    </div>
    <Brands/>
    <Products/>
    <Footer/>
    </div>
  )
}

export default Main

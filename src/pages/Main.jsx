import React from 'react'
import Button from '../components/Button'
import Header from "../layout/Header"
import { Row, Col, Carousel } from 'react-bootstrap'
import Img1 from '../assets/img1.png'
import './style.css'
import Brands from './Brands'
import Products from './Products'
import Footer from '../layout/Footer'

function Main() {
  return (
    <div>
      <Header />

      <div className='main-container my-2'>
        <div className='main-inner'>
          <div className='container pt-5'>
            <Row className='gap-5 align-items-center'>
              <Col xs={12} md={5}>
                <Row className='gap-4'>
                  <Col xs={12}>
                    <h1 className='font text-center text-md-start'>
                      Find Your Best Product With Us
                    </h1>
                  </Col>
                  <Col xs={12}>
                    <p className='text-info fs-6 fs-md-5 text-center text-md-start'>
                      Men’s fashion today is a mix of style, comfort, and confidence. From tailored suits to casual
                      streetwear, every look reflects personality and attitude. It’s all about expressing yourself with
                      elegance and ease.
                    </p>
                  </Col>
                  <Col xs={12} md={4} className='text-center text-md-start'>
                    <Button buttonname="Explore" />
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6}>
                <Row className='align-items-center justify-content-center'>
                  <Col md={3} className='d-none d-lg-block'>
                    <h1 className='fonts'>ULTIMATE</h1>
                  </Col>
                  <Col xs={12} md={9}>
                    <Carousel interval={2500} controls={false} indicators={false}>
                      <Carousel.Item>
                        <div className="text-center">
                          <img
                            className="d-block w-100 img-h carousel-img img-fluid mx-auto"
                            src={Img1}
                            alt="First slide"
                          />
                        </div>
                      </Carousel.Item>

                      <Carousel.Item>
                        <div className="text-center">
                          <img
                            className="d-block w-100 img-h carousel-img img-fluid mx-auto"
                            src={Img1}
                            alt="Second slide"
                          />
                        </div>
                      </Carousel.Item>
                    </Carousel>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <Brands />
      <Products />
      <Footer />
    </div>
  )
}

export default Main

import React from 'react'
import ProductCard  from '../components/Cards'
import Shirt1 from '../assets/shirt/img4.png';
import Shirt2 from '../assets/shirt/img5.png';
import Shirt3 from '../assets/shirt/img6.png';
import Shirt4 from '../assets/shirt/img7.png';
import pant1 from '../assets/pants/img1.png';
import pant2 from '../assets/pants/img2.png';
import pant3 from '../assets/pants/img3.png';
import pant4 from '../assets/pants/img4.png';
import Belt1 from '../assets/belt/img1.png'
import Belt2 from '../assets/belt/img2.png'
import Belt3 from '../assets/belt/img3.png'
import Belt4 from '../assets/belt/img4.png'
import './style.css'

function Products() {
  return (
    <div className='product py-5 px-5'>
        <div>
            <h1>Products For You</h1>
            <p>Explore Our Best Collection Of Products</p>
            <div>
              <h1>shirt</h1>
            <div className='d-flex align-items-center justify-content-center flex-wrap gap-4'>
                <ProductCard img={Shirt1}/>
                <ProductCard img={Shirt2}/>
                <ProductCard img={Shirt4}/>
                <ProductCard img={Shirt1}/>
                <ProductCard img={Shirt2}/>
                <ProductCard img={Shirt3}/>
                <ProductCard img={Shirt4}/>
                <ProductCard img={Shirt1}/>
                </div>
                </div>
                <div className='py-5'>
                  <h1>Pant</h1>
               <div className='d-flex align-items-center justify-content-center flex-wrap gap-4'>
                <ProductCard img={pant1}/>
                <ProductCard img={pant2}/>
                <ProductCard img={pant3}/>
                <ProductCard img={pant4}/>
                 <ProductCard img={pant1}/>
                <ProductCard img={pant2}/>
                <ProductCard img={pant3}/>
                <ProductCard img={pant4}/>
                </div>
                </div>
                                <div className='py-5'>
                  <h1>Belt</h1>
               <div className='d-flex align-items-center justify-content-center flex-wrap gap-4'>
                <ProductCard img={Belt1}/>
                <ProductCard img={Belt2}/>
                <ProductCard img={Belt3}/>
                <ProductCard img={Belt4}/>
                <ProductCard img={Belt1}/>
                <ProductCard img={Belt2}/>
                <ProductCard img={Belt3}/>
                <ProductCard img={Belt4}/>
                </div>
                </div>
        </div>
    </div>
  )
}

export default Products

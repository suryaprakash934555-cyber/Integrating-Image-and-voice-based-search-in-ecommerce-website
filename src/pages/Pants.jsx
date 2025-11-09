import React from 'react'
import Header from '../layout/Header'
import pant1 from '../assets/pants/img1.png';
import pant2 from '../assets/pants/img2.png';
import pant3 from '../assets/pants/img3.png';
import pant4 from '../assets/pants/img4.png';
import ProductCard  from '../components/Cards'

function Pants() {
  return (
    <div>
        <Header/>
          <div className='d-flex align-items-center justify-content-center flex-wrap gap-4'>
                <ProductCard img={pant1}/>
                <ProductCard img={pant2}/>
                <ProductCard img={pant3}/>
                <ProductCard img={pant4}/>
                 <ProductCard img={pant1}/>
                <ProductCard img={pant2}/>
                <ProductCard img={pant3}/>
                <ProductCard img={pant4}/>
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
  )
}

export default Pants

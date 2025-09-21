import React from 'react'
import Header from '../layout/Header'
import Shirt1 from '../assets/shirt/img4.png';
import Shirt2 from '../assets/shirt/img5.png';
import Shirt3 from '../assets/shirt/img6.png';
import Shirt4 from '../assets/shirt/img7.png';
import ProductCard  from '../components/Cards'


function Shirt() {
  return (
    <div>
      <Header/>
      <div className='d-flex align-items-center justify-content-center flex-wrap gap-4'>
                <ProductCard img={Shirt1}/>
                <ProductCard img={Shirt2}/>
                <ProductCard img={Shirt4}/>
                <ProductCard img={Shirt1}/>
                <ProductCard img={Shirt2}/>
                <ProductCard img={Shirt3}/>
                <ProductCard img={Shirt4}/>
                <ProductCard img={Shirt1}/>
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
  )
}

export default Shirt

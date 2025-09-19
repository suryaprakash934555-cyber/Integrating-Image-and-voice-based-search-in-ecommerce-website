import React from 'react'
import ProductCard  from '../components/Cards'

function Products() {
  return (
    <div className='py-5 px-5'>
        <div>
            <h1>Products For You</h1>
            <p>Explore Our Best Collection Of Products</p>
            <div className='d-flex align-items-center justify-content-center flex-wrap gap-4'>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                </div>
        </div>
    </div>
  )
}

export default Products

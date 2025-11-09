import React from 'react'
import Main from '../src/pages/Main'
import Shirt from '../src/pages/Shirt'
import Pants from '../src/pages/Pants'
import SearchResult from './layout/SearchResult'
import ProductDetail from './pages/ProductDetail' // Import ProductDetail
import { Routes, Route } from 'react-router-dom'
import Login from './Login/Login'
import { AuthProvider } from './context/AuthContext'
import Register from './Login/Register'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'
import Checkout from './pages/Checkout'
// import PaymentPage from './pages/PaymentPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div>
          <Routes>
            <Route path='/' element={<Main/>}/>
            <Route path='/all' element={<Main/>}/>
            <Route path='/shirts' element={<Shirt/>}/>
            <Route path='/pants' element={<Pants/>}/>
            <Route path="/search-results" element={<SearchResult/>} />
            <Route path="/product/:productId" element={<ProductDetail/>} /> {/* Add this route */}
            <Route path='/login' element={<Login/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* <Route path="/payment" element={<PaymentPage />} /> */}
          </Routes>
          <CartSidebar />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
 
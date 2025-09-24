import React from 'react'
import Main from '../src/pages/Main'
import Shirt from '../src/pages/Shirt'
import Pants from '../src/pages/Pants'
import SearchResult from './layout/SearchResult'
import { Routes,Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/all' element={<Main/>}/>
        <Route path='/shirts' element={<Shirt/>}/>
        <Route path='/pants' element={<Pants/>}/>
        <Route path="/search-results" element={<SearchResult/>} />
      </Routes>
    </div>
  )
}

export default App

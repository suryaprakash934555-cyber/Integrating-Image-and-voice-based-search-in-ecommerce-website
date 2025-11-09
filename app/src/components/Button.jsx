import React from 'react'
import {Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'

function Button({buttonname,bgcolor,color}) {
  return (
    <div>
     <div className='login fw-bold d-flex justify-content-between align-items-center ' style={{background:bgcolor,color:color}}>
        <Nav.Link as={Link} to="/login">{buttonname}</Nav.Link>
    </div>
    </div>
  )
}

export default Button

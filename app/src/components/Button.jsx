import React from 'react'
import {Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'

function Button({buttonname}) {
  return (
    <div>
     <div className='login fw-bold d-flex justify-content-between align-items-center '>
        <Nav.Link as={Link} to="/login">{buttonname}</Nav.Link>
    </div>
    </div>
  )
}

export default Button

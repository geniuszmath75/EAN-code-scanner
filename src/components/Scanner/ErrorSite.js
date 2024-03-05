import React from 'react'
import './ErrorSite.css'

function ErrorSite(props) {
  return (
    <div className='error-container'>
      <div className='error-message'>{props.message}</div>
    </div>
  )
}

export default ErrorSite

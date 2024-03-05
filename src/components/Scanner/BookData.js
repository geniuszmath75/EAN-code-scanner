import React from 'react'
import './BookData.css';

function BookData(props) {
  return (
    <div className='container-wrapper'>
      <div className='data-container'>
        <div className='property-container'>
            <h2 className='header'>Tytuł:</h2>
            <div className='property'>{props.tytul}</div>
        </div>
        <div className='property-container'>
            <div className='property'>
              <img className='book-cover' src={props.obraz} alt='okładka'/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default BookData

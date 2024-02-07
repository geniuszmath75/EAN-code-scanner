import React from 'react'

function BookData(props) {
  return (
    <div className='container-wrapper'>
      <div className='data-container'>
        <div className='property-container'>
            <hr />
            <h2 className='header'>Tytuł:</h2>
            <div className='property'>{props.e_title}</div>
            <hr />
        </div>
        <div className='property-container'>
            <hr />
            <h2 className='header'>Cena netto:</h2>
            <div className='property'>{props.e_cena_netto}zł</div>
            <hr />
        </div>
        <div className='property-container'>
            <hr />
            <h2 className='header'>Typ:</h2>
            <div className='property'>{props.e_typ}</div>
            <hr />
        </div>
      </div>
    </div>
  )
}

export default BookData

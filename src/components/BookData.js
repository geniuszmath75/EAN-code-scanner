import React from 'react'

function BookData(props) {
  return (
    <div className='container-wrapper'>
      <div className='data-container'>
        <div className='property-container'>
            <hr />
            <h2 className='header'>Tytuł:</h2>
            <div className='property'>{props.tytul}</div>
            <hr />
        </div>
        <div className='property-container'>
            <hr />
            <div className='property'>
              <img className='book-cover' src={props.obraz}/>
            </div>
            <hr />
        </div>
        {/* <div className='property-container'>
            <hr />
            <h2 className='header'>Typ:</h2>
            <div className='property'>{props.e_typ}</div>
            <hr />
        </div> */}
      </div>
    </div>
  )
}

export default BookData

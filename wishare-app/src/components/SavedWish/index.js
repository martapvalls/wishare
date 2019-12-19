import React from 'react'
const API_URL = process.env.REACT_APP_API_URL

export default function( { savedWish, removeWish, blockWish } ){
    return <>
    <div className="saved-wishes__owner">
    <img className="saved-wishes__img" src={`${API_URL}/users/profileimage/${savedWish.id}?timestamp=${Date.now()}`}/>
    <h2>{savedWish.name}'s Wish</h2>
</div>
<div className="saved-wishes__detail">
    <img className="saved-wishes__wimage"  src={`${API_URL}/wishes/${savedWish.id}/wish/${savedWish.wish.toString()}?timestamp=${Date.now()}`}/>
    <span className="saved-wishes__price">{savedWish.price} €</span>
</div>
<div className="saved-wishes__info">
    <span className="saved-wishes__wname"> {savedWish.title} </span>
    <p className="saved-wishes__wdescription">{savedWish.description}</p>
   {!savedWish.given && !savedWish.blocked && <a className="saved-wishes__link" href={savedWish.link}> Online Store </a>}
   {savedWish.given && <p className="saved-wishes__given"> GIVEN GIFT!! </p>}
   {savedWish.blocked && <p className="saved-wishes__given"> THIS GIFT HAS BEEN BLOCKED!! </p>}

</div>
<div className="saved-wishes__buttonscontainer">
    <button className="saved-wishes__button" onClick={event => { event.preventDefault(); removeWish(savedWish.id, savedWish.wish ) }}>Remove</button>
    {!savedWish.blocked && <button className="saved-wishes__button" onClick={event => { event.preventDefault(); blockWish(savedWish.id, savedWish.wish ) }}>Block</button>}
</div>
</>
}
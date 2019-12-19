import React from 'react'
import './index.sass'
const API_URL = process.env.REACT_APP_API_URL

export default function ({ wish : {id, title, price, link, description, given}, user, onEditWish, deleteWish, givenWish }){
    return <>
    <div className="mywishes__detail">
        <img className="mywishes__wimage" src={`${API_URL}/wishes/${user.id}/wish/${id}?timestamp=${Date.now()}`}/>
        <span className="mywishes__price">{price} €</span>
    </div>
    <div className="mywishes__info">
        <span className="mywishes__wname"> {title} </span>
        <p className="mywishes__wdescription">{description}</p>
        {!given && <a className="mywishes__link" href={link} > Online Store </a>}
        {given && <p className="mywishes__given"> GIVEN GIFT!! </p>}
    </div>
    <div className="mywishes__buttonscontainer">
        <button className="mywishes__button" onClick={event => { event.preventDefault(); onEditWish(id) }}>Edit</button>
        <button className="mywishes__button" onClick={event => { event.preventDefault(); deleteWish(id) }}>Remove</button>
        {given && <button className="mywishes__button"onClick={event => { event.preventDefault(); givenWish(id) }}>Not Given</button>}
        {!given && <button className="mywishes__button"onClick={event => { event.preventDefault(); givenWish(id) }}>Given</button>}
    </div>
</>
}
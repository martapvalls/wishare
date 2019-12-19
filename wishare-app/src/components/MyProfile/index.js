import React from 'react'
import './index.sass'
const API_URL = process.env.REACT_APP_API_URL

export default function({ user, onEditProfile }){

    return <section className="myprofile hidden">
    <section className="myprofile__header">
        <h1 className="myprofile__title">My Profile</h1>
        <section className="myprofile__buttons">
            <button className="myprofile__btn"> My profile</button>
            <button className="myprofile__btn" onClick={event => { event.preventDefault(); onEditProfile() }}> Edit profile</button>
        </section>
    </section>

    <section className="myprofile__user">
        <h2 className="myprofile__name"> {user.name} {user.surname} </h2>
        <img className="myprofile__image" src={`${API_URL}/users/profileimage/${user.id}?timestamp=${Date.now()}`} alt="profile picture"/>
        <span className="myprofile__email"> {user.email}</span>
        <span className="myprofile__bday"> B-day: {user.birthday} </span>
        <p className="myprofile__description"> {user.description} </p>
    </section>
</section>
}


// src={process.env.PUBLIC_URL + '/img/profile.png'}
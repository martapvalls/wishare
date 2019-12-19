import React from 'react'
import './index.sass'
import Wish from '../Wish'

export default function({ onCreateWish, wishes, user, onEditWish, deleteWish, givenWish }){

    return <section className="mywishes hidden">
    <section className="mywishes__header">
        <h1 className="mywishes__title"> My Wishes</h1>
        <section className="mywishes__buttons">
            <button className="mywishes__btn"> My Wishes </button>
            <button className="mywishes__btn" onClick={event => { event.preventDefault(); onCreateWish() }}> Add a Wish </button>
        </section>
    </section>
    <section className="mywishes__wishes">
        <ul className="mywishes__list">
            {wishes.map(wish => <li className="mywishes__wish" key={wish.id}><Wish wish={wish} user={user} onEditWish={onEditWish} deleteWish={deleteWish} givenWish={givenWish} /></li>)}
            {wishes.length < 1 && <p className="mywishes__nowish"> You have no wishes, go to add a Wish to create new wishes</p>}
        </ul>
    </section>
</section>
}
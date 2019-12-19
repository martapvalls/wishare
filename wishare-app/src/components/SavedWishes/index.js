import React from 'react'
import './index.sass'
import SavedWish from '../SavedWish'

export default function({ savedWishes, removeWish, blockWish }){

    return <section className="saved-wishes">
    <section className="saved-wishes__header">
        <h1 className="saved-wishes__title">Saved Wishes</h1>
    </section>

    <section className="saved-wishes__wishes">
        <ul className="saved-wishes__list">

        {savedWishes.map(savedWish => <li className="saved-wishes__wish" key={savedWish.wish}  ><SavedWish savedWish={savedWish} removeWish={removeWish} blockWish={blockWish}/></li>)}
        
        </ul>
    </section>
</section>
}
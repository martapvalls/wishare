import React from 'react'
import './index.sass'
const API_URL = process.env.REACT_APP_API_URL

export default function ({ user, birthdays, onCreateWish, onSearchFriends, savedWishes, onSavedWishes }) {

    return <section className="landing hidden">
        <section className="landing__birthday">
            {birthdays.length < 1 && <h2 className="landing__bdaytitle"> There is no friend's birthday nearby</h2>}

            {birthdays && <ul>
                {birthdays.map(bday => <li key={bday.id}>
                    <h2 className="landing__bdaytitle"> {bday.name}'s birthday is comming on {bday.birthday}!! </h2>
                </li>)}
            </ul>}

        </section>

        <section className="landing__user user">
            <img className="user__image" src={`${API_URL}/users/profileimage/${user.id}?timestamp=${Date.now()}`} alt="profile picture" />
            <span className="user__welcome"> Hi {user.name}, what do you want to do?</span>
            <section className="landing__buttons">
                <button className="landing__btn" onClick={event => { event.preventDefault(); onCreateWish() }}> Create a Wish</button>
                <button className="landing__btn" onClick={event => { event.preventDefault(); onSearchFriends() }}> Search friends</button>
            </section>
        </section>

        <section className="landing__pendingwishes">
            <h2 className="landing__title">Saved Wishes</h2>
            <section className="landing__imgwishes">
                <a  href="#" className="list__item" onClick={event => { event.preventDefault(); onSavedWishes() }}>
                    <ul className="landing__savedwisheslist">
                        {savedWishes.map(savedWish => <li key={savedWish.wish} className="landing__savedwishesitem">
                            <img src={`${API_URL}/wishes/${savedWish.id}/wish/${savedWish.wish.toString()}?timestamp=${Date.now()}`} alt="pending wishes" className="landing__wish" />
                        </li>)}
                    </ul>
                </a>
            </section>
        </section>
    </section>

}

import React, { useEffect, useState } from 'react'
import './index.sass'
import { retrieveFriend } from '../../logic'
import Feedback from '../Feedback'
const API_URL = process.env.REACT_APP_API_URL

export default function ({ id, onMyFriends, saveWish, onChatRoom, error }) {
    const [friend, setFriend] = useState({})
    const [friendId, setFriendId] = useState()

    useEffect(() => {
        const { token } = sessionStorage;
        if (token) {
            (async () => {

                const friend = await retrieveFriend(token, id)

                setFriend(friend)

                const friendId = id

                setFriendId(friendId)

            })()
        }
    }, [sessionStorage.token])

    const { name, surname, email, birthday, description, wishes } = friend

    return <section className="friend-detail hidden">
        <section className="friend-detail__container">
            <button className="friend-detail__back" onClick={event => { event.preventDefault(); onChatRoom(friendId) }}> ChatRoom </button>
            <button className="friend-detail__back" onClick={event => { event.preventDefault(); onMyFriends() }}> Back </button>
        </section>
        {error && < Feedback message={error} />}
        <section className="friend-detail__user">
            <h2 className="friend-detail__name">{name} {surname}</h2>
            <img className="friend-detail__image" src={`${API_URL}/users/profileimage/${friendId}?timestamp=${Date.now()}`} alt="profile picture" />
            <div className="friend-detail__data">
                <span className="friend-detail__email"> {email}</span>
                <p className="friend-detail__bday"> B-day: {birthday}</p>
                <p className="friend-detail__description"> {description}</p>
            </div>
        </section>

        <section className="friend-detail__wishes">
            <h2 className="friend-detail__title">{name}'s Wishes</h2>
                {wishes && wishes.length < 1 && <p className="mywishes__nowish"> {name} has no wishes added</p>}
            <ul className="friend-detail__list">
                {wishes && wishes.map(wish => <li className="friend-detail__wish" key={wish.id}>
                    <div className="friend-detail__detail">
                        <img className="friend-detail__wimage" src={`${API_URL}/wishes/${friendId}/wish/${wish.id.toString()}?timestamp=${Date.now()}`} />
                        <span className="friend-detail__price">{wish.price} €</span>
                    </div>
                    <div className="friend-detail__info">
                        <span className="friend-detail__wname"> {wish.title} </span>
                        <p className="friend-detail__wdescription">{wish.description}</p>
                        {!wish.given && <a className="friend-detail__link" href={wish.link} > Online Store </a>}
                        {wish.given && <p className="friend-detail__given"> GIVEN GIFT!! </p>}
                    </div>
                    <div className="friend-detail__btn">
                    {!wish.given && <button className="friend-detail__save" onClick={event => { event.preventDefault(); saveWish(wish.id, id) }}>Save wish</button>}
                    </div>
                </li>)}
            </ul>
        </section>
    </section>
}
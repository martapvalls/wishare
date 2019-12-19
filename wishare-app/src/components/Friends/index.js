import React from 'react'
import './index.sass'
import Friend from '../Friend'

export default function({onSearchFriends, friends, deleteFriend, onFriendDetail}){
    return <section className="friends">
    <section className="friends__header">
        <h1 className="friends__title">Friends</h1>
        <section className="friends__buttons">
            <button className="friends__btn"> Your friends</button>
            <button className="friends__btn" onClick={event => { event.preventDefault(); onSearchFriends() }}> Find friends</button>
        </section>
    </section>

    <ul className="friends__list">
        { friends.map(friend => <li className="friends__link" key={friend.id}  ><Friend friend={friend} deleteFriend={deleteFriend} onFriendDetail={onFriendDetail} /></li>)}
    </ul>
</section>
}
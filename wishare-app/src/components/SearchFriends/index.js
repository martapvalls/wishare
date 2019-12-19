import React from 'react'
import './index.sass'
import Feedback from '../Feedback'
import UsersList from '../UsersList'

export default function ({ onSearch, error, users, onMyFriends, addFriend }) {
    return <section className="searchf hidden">
        <section className="searchf__header">
            <h1 className="searchf__title">Friends</h1>
            <section className="searchf__buttons">
                <button className="searchf__btn" onClick={event => { event.preventDefault(); onMyFriends() }}> Your friends</button>
                <button className="searchf__btn"> Find friends</button>
            </section>
        </section>

        <form className="searchf__search" onSubmit={event => {
            event.preventDefault()

            const query = event.target.query.value

            onSearch(query)
        }} >
            <span className="searchf__searchtitle">Find your friends by e-mail adress</span>
            <input className="searchf__searchinput" type="search" id="search" name="query" />
            <button className="searchf__searchbtn">Search</button>
            {error && <Feedback message={error} />}
        </form>


        {users && < UsersList users={users} addFriend={addFriend} />}

    </section>
}
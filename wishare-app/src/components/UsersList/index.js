import React from 'react'
import './index.sass'
import User from '../User'

export default function({users, addFriend}){
    return     <ul className="searchf__list">
   { users.map(user => <a className="searchf__link" key={user.id}><User user={user} addFriend={addFriend} /></a>)}
</ul>
}
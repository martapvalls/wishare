import React from 'react'
const API_URL = process.env.REACT_APP_API_URL

export default function({ user : { id, name, wishes }, addFriend}){
    return <li className="searchf__item">
    <div className="searchf__info">
        <span className="searchf__name">{name}</span>
        <img className="searchf__photo" src={`${API_URL}/users/profileimage/${id}`} alt="profile photo"/>
        <button className="searchf__add" onClick={event => { event.preventDefault(); addFriend(id) }}> Add friend</button>
    </div>
    <div className="searchf__wishes">
        <ul className="searchf__wisheslist">
            {wishes.map(wish => <li key={wish._id} className="searchf__wishesitem">
             <img src={`${API_URL}/wishes/${id}/wish/${wish._id.toString()}`} alt="pending wishes" className="searchf__wish"/>
            </li>)}
            
        </ul>

    </div>
</li>
}

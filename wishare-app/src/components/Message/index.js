import React, {useEffect, useState} from 'react'
import { retrieveFriend } from '../../logic'
import moment from 'moment'
import './index.sass'
const API_URL = process.env.REACT_APP_API_URL

export default function({message : {user: userId, text, date}}){
    const [user, setUser] = useState()

    useEffect(() => {
        try {
            const { token } = sessionStorage;

            (async() => {
                setUser(await retrieveFriend(token, userId))
            })()

        } catch (error) {
            console.log(error.message)
        }
    }, [setUser])

    return  <> 
    {user && <><div className="chat__imgcontainer">
    <img src={`${API_URL}/users/profileimage/${userId}?timestamp=${Date.now()}`} className="chat__photo" />
</div>
<div className="chat__usercontainer">
    <span className="chat__user">{user.name} {user.surname}</span>
    <span className="chat__date">{moment(date).format("D/MM/YYYY")}</span>
    <p className="chat__text"> {text}</p>
</div> </>}
</>
}
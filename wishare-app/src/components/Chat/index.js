import React, { useEffect, useState, useRef } from 'react'
import './index.sass'
import { retrieveChat } from '../../logic'
import Message from '../Message'

export default function ({ id, onBack, onSendMessage }) {

    const [chat, setChat] = useState({})
    const [friendId, setFriendId] = useState()
    let refresher
    //const textAreaRef = useRef(null)
    

    useEffect(() => {
        if (typeof refresher !== 'number') refresher = setInterval(() => {
            (async () => {
                try {
                    const { token } = sessionStorage

                    setChat(await retrieveChat(token, id))
                    
                    const friendId = id
                    
                    setFriendId(friendId)
                    
                    //setTimeout(function(){textAreaRef.current.focus() }, 1000)

                } catch (error) {
                    console.log(error.message)
                }
            })()
        }, 1000);

        return () => { clearInterval(refresher) }
    }, [setChat])

    return <>
        {chat.owner && <section className="chat">
            <section className="chat__owner-info">
                <h1 className="chat__owner"> {chat.owner.name}'s ChatRoom </h1>
                <button className="chat__back" onClick={event => { event.preventDefault(); onBack(friendId) }}> Back </button>
            </section>
            <section className="chat__container">
                <ul className="chat__messages">
                    {chat.message && chat.message.map(message => <li className="chat__message" key={message._id}><Message message={message} /></li>)}
                </ul>
                    <section className="chat_sendmessage" >
                        <form className="chat__form" name="text" onSubmit={function (event) {
                            event.preventDefault();

                            const { text: { value: text } } = event.target

                            onSendMessage(text, friendId);

                            event.target.text.value = ''

                        }}>
                            <textarea className="chat__textarea" /*ref={textAreaRef}*/ name="text" cols="30 " rows="3"
                                placeholder="send a message ... "></textarea>
                            <button className="chat__button">send</button>
                        </form>
                    </section>
            </section>
        </section>}
    </>
}
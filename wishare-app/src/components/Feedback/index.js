import React from 'react'
import './index.sass'

export default function({ message }){
    return <section className="feedback">
    <p className="feedback__message">{ message }</p>
</section>
}
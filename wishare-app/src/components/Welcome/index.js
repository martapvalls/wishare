import React from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'

export default withRouter (function ({ history }) {
    function handleGoRegister() { history.push('/register') }

    return <section className="welcome">
        <section className="welcome__section1">
            <h2 className="welcome__title1">Welcome to</h2>
        </section>
        <section>
            <h1 className="welcome__title"> WiShare</h1>
        </section>
        <section className="welcome__intro">
            <p className="welcome__text">Create a WishList</p>
            <button className="welcome__btn"> 
            <img className="welcome__img" src={process.env.PUBLIC_URL + '/img/welcome.png'} alt="gift" onClick={event => { event.preventDefault(); handleGoRegister() }}/>
            </button>
        </section>
    </section>
})

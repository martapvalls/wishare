import React from 'react'
import './index.sass'
import Feedback from '../Feedback'

export default function( { goLogin, onRegister, error }) {

    
    return <section className="register">

    <h1 className="register__title">Register</h1>

    {error && < Feedback message={error} />}

    <form className="register__form" onSubmit={function(event){
        event.preventDefault()
    
            const { name: { value: name}, surname: {value: surname}, email: { value: email}, year: {value: year}, month: {value: month}, day: {value: day}, password: {value: password}, passwordconfirm: {value: passwordconfirm} } = event.target

            onRegister(name, surname, email, year, month, day, password, passwordconfirm)
    }}>
        <label>Name</label>
        <input className="register__field" type="text" name="name" placeholder="name"/>
        <label>Surname</label>
        <input className="register__field" type="text" name="surname" placeholder="surname"/>
        <label>E-mail</label>
        <input className="register__field" type="email" name="email" placeholder="e-mail"/>
        <label>Birthday</label>
        <div className="register__birthday">
            <select className="register__input" name="day">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
            </select>
            <select className="register__input" name="month">
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
            <input className="register__input" type="number" min="1900" max="2020" step="1" placeholder="2016" name="year" />
        </div>

        <label>Password</label>
        <input className="register__field" type="password" name="password" placeholder="*****"/>
        <label>Confirm Password</label>
        <input className="register__field" type="password" name="passwordconfirm" placeholder="*****"/>
        <button className="register__submit">Register</button>

    </form>
    <span className="register__login">Already registered?</span> <a className="register__login" href='' onClick={event => { event.preventDefault(); goLogin() }}>Log in</a>
</section>

}
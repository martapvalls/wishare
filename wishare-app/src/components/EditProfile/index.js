import React from 'react'
import './index.sass'

export default function ({ onMyProfile, onModify }) {

    

    return <section className="editprofile hidden">
        <section className="editprofile__header">
            <h1 className="editprofile__title">My Profile</h1>
            <section className="editprofile__buttons">
                <button className="editprofile__btn" onClick={event => { event.preventDefault(); onMyProfile() }}> My profile</button>
                <button className="editprofile__btn"> Edit profile</button>
            </section>
        </section>

        <section className="editprofile__section">
            <form className="editprofile__form" onSubmit={function (event) {
            event.preventDefault()

            const { file: { files : [image]}, day: { value: day }, month: { value: month }, year: { value: year }, password: { value: password }, description: { value: description } } = event.target

            onModify(image, day, month, year, password, description)
        }}>

                <label>Profile picture</label>
                <input type="file" name="file" accept="image/*" />
                <label>Birthday</label>
                <div className="editprofile__birthday">
                    <select className="editprofile__input" name="day">
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
                    <select className="editprofile__input" name="month">
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
                    <input className="editprofile__input" type="number" min="1900" max="2020" step="1" placeholder="2016" name="year" />
                </div>
                <label>Password</label>
                <input className="editprofile__field" type="password" name="password" placeholder="password" />
                <label>Description</label>
                <textarea rows="4" cols="50" className="editprofile__description" name="description"></textarea>
                <button className="editprofile__submit">Save</button>

            </form>
        </section>
    </section>
} 
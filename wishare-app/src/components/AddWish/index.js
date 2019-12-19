import React from 'react'
import './index.sass'

export default function({onMyWishes, onAddWish}){
    return <section className="editwish hidden">
    <section className="editwish__header">
        <h1 className="editwish__title">My Wishes</h1>
        <section className="editwish__buttons">
            <button className="editwish__btn" onClick={event => { event.preventDefault(); onMyWishes() }}> My Wishes </button>
            <button className="editwish__btn"> Add a Wish </button>
        </section>
    </section>
    <section className="editwish__content">
        <form className="editwish__form" onSubmit={function (event) {
            event.preventDefault()

            const { file: { files : [image]}, title: { value: title }, price: { value: price }, link: { value: link }, description: { value: description } } = event.target

            onAddWish(image, title, link, price, description)
        }}>
            <label>Title</label>
            <input className="editwish__field" type="text" name="title" placeholder="title" required/>
            <label>Image</label>
            <input type="file" name="file" accept="image/*" required/>
            <label>Price</label>
            <input className="editwish__field" type="text" name="price" placeholder="price"required/>
            <label>Link</label>
            <input className="editwish__field" type="text" name="link" placeholder="online shop" required/>
            <label>Description</label>
            <textarea rows="4" cols="50" className="editwish__description" name="description" required></textarea>
            <button className="editwish__submit">Save</button>
        </form>
    </section>
</section>
}
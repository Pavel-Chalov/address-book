import { useEffect, useMemo, useState } from "react"
import style from "./style.css"
import countries from "../../../countries.json"

export default function Home() {
    const [data, setData] = useState(null)
    const [addresses, setAddresses] = useState(null)
    const [modal, setModal] = useState(false)
    const [name, setName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [index, setIndex] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("Russian Federation")
    const [whoIs, setWhoIs] = useState("Родственник")

    const [search, setSearch] = useState("")

    const [modal2, setModal2] = useState(false)
    const [choosed, setChoosed] = useState(null)

    useMemo(() => {
        try {
            if(addresses.error.type == "user") {
                window.location.replace("/auth")
            }
        } catch (error) {
            
        }
    }, [addresses])

    const sorted = useMemo(() => {
        if(data) {
            return addresses.filter(el => el.name.includes(search) || el.firstName.includes(search) || el.lastName.includes(search)||
            el.email.includes(search) || el.phone.includes(search) || el.address.includes(search) || el.index.includes(search) || el.city.includes(search) || el.country.includes(search) || el.whoIs.includes(search))
        }
    }, [addresses, search])

    function nameHandler(e) {
        const value = e.target.value.replace(/  /g, " ")
        setName(value)
    }

    function firstNameHandler(e) {
        const value = e.target.value.replace(/ /g, "")
        setFirstName(value)
    }

    function lastNameHandler(e) {
        const value = e.target.value.replace(/ /g, "")
        setLastName(value)
    }

    function emailHandler(e) {
        const value = e.target.value.replace(/ /g, "")
        setEmail(value)
    }

    useEffect(() => {
        fetch('/get-user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                try {
                    if(data.error.type == "user") {
                        window.location.replace("/auth")
                    } else {
                        alert("Проблемы с сервером. Попробуйте позже.")
                    }
                } catch (error) {
                
                }
            } else {
                setData(data)
                setAddresses(data.user.addresses)
            }
        })
    }, [])

    function defaultValue() {
        setModal(false)
        setName("")
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        setAddress("")
        setIndex("")
        setCity("")
        setCountry("Russian Federation")
        setWhoIs("Родственник")
        setChoosed(null)
        setModal2(false)
        setModal(false)
    }

    async function createAddress(e) {
        e.preventDefault()
        try {
            await fetch('/addAddress', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                },
                body: JSON.stringify({
                    name: name,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    address: address,
                    index: index,
                    city: city,
                    country: country,
                    whoIs: whoIs,
                })
            })
            .then(response => response.json())
            .then(res => {
                setAddresses(JSON.parse(res.addresses))
                defaultValue()
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function deletAddress(e) {
        e.preventDefault()
        try {
            await fetch('/deleteAddress', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                },
                body: JSON.stringify({
                    id: choosed,
                })
            })
            .then(response => response.json())
            .then(res => {
                setAddresses(JSON.parse(res.addresses))
                defaultValue()
            })
        } catch (error) {
            
        }
    }

    async function updateAddress(e) {
        e.preventDefault()
        try {
            await fetch('/updateAddress', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                },
                body: JSON.stringify({
                    id: choosed,
                    arr: {
                        name: name,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                        address: address,
                        index: index,
                        city: city,
                        country: country,
                        whoIs: whoIs,
                    }
                })
            })
            .then(response => response.json())
            .then(res => {
                setAddresses(res.addresses)
                defaultValue()
            })
        } catch (error) {
            console.log(error)
        }
    }

    function setValues(item) {
        setModal2(true)
        setModal(true)
        setChoosed(item.id)
        setName(item.name)
        setFirstName(item.firstName)
        setLastName(item.lastName)
        setEmail(item.email)
        setPhone(item.phone)
        setAddress(item.address)
        setIndex(item.index)
        setCity(item.city)
        setCountry(item.country)
        setWhoIs(item.whoIs)
    }


    return(
        <>
        <div id = "fullscreen-div" className={modal ? "active" : ""} onClick={() => defaultValue()}></div>
        <form className = {"modal " + (modal ? "active" : "")} id = "modal" autoComplete="off">
            <div className = "modal-content">
                <div className = "modal-head">
                    <h3 id = "modal-title">Добавить адрес</h3>
                    <button type="button" id = "close-btn" onClick={() => defaultValue()}>
                        <i className = "fas fa-times"></i>
                    </button>
                </div>
                <div className = "modal-main">
                    <div className = "modal-row">
                        <div className = "modal-col">
                            <label for="">Как следует адресовать вашу почту?</label>
                            <input value={name} onChange={e => nameHandler(e)} type = "text" placeholder="Например, Семья Ивановых" className = "form-control" name = "addr_ing_name" />
                        </div>
                    </div>

                    <div className = "modal-row grid-row">
                        <div className = "modal-col">
                            <label for="">Имя</label>
                            <input value={firstName} onChange={e => firstNameHandler(e)} type = "text" placeholder="Иван" className = "form-control" name = "first_name" />
                        </div>
                        <div className = "modal-col">
                            <label for="">Фамилия</label>
                            <input value={lastName} onChange={e => lastNameHandler(e)} type = "text" placeholder="Иванов" className = "form-control" name = "last_name" />
                        </div>
                    </div>

                    <div className = "modal-row grid-row">
                        <div className = "modal-col">
                            <label for="">Электронная почта</label>
                            <input value={email} onChange={e => emailHandler(e)} type = "email" placeholder="address.book@mail.ru" className = "form-control" name = "email" />
                        </div>
                        <div className = "modal-col">
                            <label for="">Телефон</label>
                            <input value={phone} onChange={phone => setPhone(phone.target.value)} type = "text" placeholder="+7 (000) 000-0000" className = "form-control" name = "phone" />
                        </div>
                    </div>

                    <div className = "modal-row grid-row">
                        <div className = "modal-col">
                            <label for="">Адрес улицы</label>
                            <input value={address} onChange={e => setAddress(e.target.value)} type = "text" placeholder="Адрес дома, квартиры..." className = "form-control" name = "street_addr" />
                        </div>
                        <div className = "modal-col">
                            <label for="">Почтовый индекс</label>
                            <input value={index} onChange={e => setIndex(e.target.value)} type = "text" placeholder="60323" className = "form-control" name = "postal_code" />
                        </div>
                    </div>

                    <div className = "modal-row grid-row">
                        <div className = "modal-col">
                            <label for="">Город</label>
                            <input value={city} onChange={e => setCity(e.target.value)} type = "text" placeholder="Москва" className = "form-control" name = "city" />
                        </div>
                        <div className = "modal-col">
                            <label for="">Страна</label>
                            <select value={country} onChange={e => setCountry(e.target.value)} id = "country-list" name = "country">
                                {countries.map(item => 
                                    <option selected={item.abbreviation == "RU" ? true : false}>{item.country}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className = "modal-row">
                        <div className = "modal-col">
                            <label for = "">Кто вам</label>
                            <select value={whoIs} onChange={e => setWhoIs(e.target.value)} name = "labels">
                                <option value = "Родстенник">Родстенник</option>
                                <option value = "Друг">Друг</option>
                                <option value = "Коллега">Коллега</option>
                            </select>
                        </div>
                    </div>

                    <div className = "modal-row" id = "modal-btns">
                        {modal2 ? 
                            <>
                                <button onClick={e => updateAddress(e)} type = "submit" id = "update-btn">Обновить</button>
                                <button onClick={e => deletAddress(e)} type = "submit" id = "delete-btn">Удалить</button>
                            </>
                            :
                            <button onClick={e => createAddress(e)} type = "submit" id = "save-btn">Сохранить</button>
                        }
                    </div>
                </div>
            </div>
        </form>
            <div className = "addr-book" id = "addr-book">
                <div className = "addr-book-content">
                    <div className = "addr-book-head">
                        <i className = "fa-solid fa-address-book fa-2x"></i>
                        <h2>Address<span>Book</span></h2>
                        <div className="auth">
                            <div className="auth__name">{data ? data.user.name : null}</div>
                            <button onClick={() => {localStorage.setItem("token", null); window.location.replace("/auth")}} className="auth__leave">Выйти</button>
                        </div>
                    </div>

                    <div className = "addr-book-top">
                        <button type = "button" className = "btn" id = "add-btn" onClick={() => setModal(true)}>
                            <span><i className = "fas fa-plus"></i> Добавить</span>
                        </button>
                        <input onChange={e => setSearch(e.target.value)} value={search} type="text" className="search" placeholder="Поиск" />
                    </div>

                <div className = "addr-book-list" id = "addr-book-list">
                    <table className = "addr-table">
                        <thead>
                            <tr>
                                <th>Индекс</th>
                                <th>Адрес</th>
                                <th>Кто вам</th>
                                <th>Имя</th>
                                <th>Телефон</th>
                            </tr>
                        </thead>
                            <tbody>
                                {sorted ? sorted.map(item => 
                                    <tr onClick={() => {setValues(item)}}>
                                    <td>{item.id + 1}</td>
                                    <td>
                                        <span class = "addressing-name">{item.name}</span><br/><span class = "address">{item.address} - {item.index}, {item.city}</span>
                                    </td>
                                    <td><span>{item.whoIs}</span></td>
                                    <td>{item.firstName} {item.lastName}</td>
                                    <td>{item.phone}</td>
                                    </tr>
                                ): ""}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
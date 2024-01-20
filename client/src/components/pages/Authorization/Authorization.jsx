import { useMemo, useState } from "react";
import style from "./style.css"
import $ from 'jquery';

export default function Authorization() {
    const [regData, setRegData] = useState(null)

    const [regName, setRegName] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [regRepeat, setRegRepeate] = useState("")

    const [regNameDirty, setRegNameDirty] = useState(false)
    const [regPasswordDirty, setRegPasswordDirty] = useState(false)
    const [regRepeatDirty, setRegRepeatDirty] = useState(false)

    const [regNameErr, setRegNameErr] = useState("Имя не может быть пустым!")
    const [regPasswordErr, setRegPasswordErr] = useState("Пароль не может быть пустым!")
    const [regRepeatErr, setRegRepeateErr] = useState("Пароли не совпадают!")

    const renderRegData = useMemo(() => {
        try {
            if(regData.error) {
                switch(regData.error.type) {
                    case "name": 
                        setRegNameErr(regData.error.message)
                        break
                    case "server":
                        alert("Ошибка сервера, повторите позже.")
                        break
                }
                return
            }
            if(regData.success) {
                setRegName("")
                setRegPassword("")
                setRegRepeate("")

                setRegNameDirty(false)
                setRegPasswordDirty(false)
                setRegRepeatDirty(false)
            }
        } catch (error) {
            //console.log(error)
        }
    }, [regData])

    function blurRegHandler(e) {
        switch(e.target.name) {
            case "name":
                setRegNameDirty(true)
                break
            case "password":
                setRegPasswordDirty(true)
                break
            case "repeate":
                setRegRepeatDirty(true)
                break
        }
    }

    function regNameHandler(e) {
        const value = e.target.value.replace(/ /g, "_")
        setRegName(value)
        if(value.length == 0) {
            setRegNameErr("Имя не может быть пустым!")
        } else if(value.length < 3) {
            setRegNameErr("Имя должно быть не менее 3 символов!")
        } else if(value.length > 24) {
            setRegNameErr("Имя не должно быть более 24 символов!")
        } else {
            setRegNameErr(null)
        }
    }

    function regPasswordHandler(e) {
        const value = e.target.value.replace(/ /g, "")
        setRegPassword(value)
        if(e.target.value.trim().length == 0) {
            setRegPasswordErr("Пароль не может быть пустым!")
        } else if(e.target.value.trim().length < 8) {
            setRegPasswordErr("Пароль должен быть не менее 8 символов!")
        } else if(e.target.value.trim().length > 42) {
            setRegPasswordErr("Пароль не должнен быть более 42 символов!")
        } else {
            setRegPasswordErr(null)
        }

        if(value != regRepeat) {
            setRegRepeateErr("Пароли не совпадают")
        } else {
            setRegRepeateErr(null)
        }
    }

    function regRepeatHandler(e) {
        const value = e.target.value.replace(/ /g, "")
        setRegRepeate(value)
        if(value != regPassword) {
            setRegRepeateErr("Пароли не совпадают")
        } else {
            setRegRepeateErr(null)
        }
    }

    // Запрос на регистрацию
    async function signIn(e) {
        e.preventDefault()
        try {
            if(!regNameErr && !regPasswordErr && !regRepeatErr) {
                await fetch('/registration', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: regName,
                        password: regPassword
                    })
                })
                .then(response => response.json())
                .then(data => setRegData(data));
            } else {
                alert("Заполните все поля")
            }
        } catch (error) {
            console.log(error)
        }
    }

    // ====================================================================================================================================

    const [logData, setLogData] = useState(null)

    const [logName, setLogName] = useState("")
    const [logPassword, setLogPassword] = useState("")

    const [logNameDirty, setLogNameDirty] = useState(false)
    const [logPasswordDirty, setLogPasswordDirty] = useState(false)

    const [logNameErr, setLogNameErr] = useState(null)
    const [logPasswordErr, setLogPasswordErr] = useState(null)

    function blurLogHandler(e) {
        switch(e.target.name) {
            case "name":
                setLogNameDirty(true)
                break
            case "password":
                setLogPasswordDirty(true)
                break
        }
    }

    function logNameHandler(e) {
        const value = e.target.value.replace(/ /g, "_")
        setLogName(value)
        setLogNameErr(null)
    }
    function logPasswordHandler(e) {
        const value = e.target.value.replace(/ /g, "")
        setLogPassword(value)
        setLogPasswordErr(null)
    }

    async function logIn(e) {
        e.preventDefault()
        try {
            if(!logNameErr && !logPasswordErr) {
                await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: logName,
                        password: logPassword
                    })
                })
                .then(response => response.json())
                .then(data => setLogData(data));
            } else {
                alert("Заполните все поля")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const renderLogData = useMemo(() => {
        try {
            if(logData.error) {
                switch(logData.error.type) {
                    case "user":
                        setLogNameErr(logData.error.message)
                        break
                    case "password":
                        setLogPasswordErr(logData.error.message)
                        break
                    case "server":
                        alert(logData.error.message)
                        break
                }
                return
            }
            if(logData.token) {
                console.log(logData.token)
                localStorage.setItem("token", logData.token)
                window.location.replace('http://localhost:3000/');
                return
            }
            window.location.replace('http://localhost:3000/authorization');
        } catch (error) {
            
        }
    }, [logData])

    window.onload = () => {
        $('.message span').click(function(){
            $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
        });
    }

    return(
        <>
        <div className="authorization">
            <div className="login-page">
                <div className="form">
                    <form className="register-form" onSubmit={e => signIn(e)}>
                        {regData ? regData.success ? <div className="success-msg">Вы успешно заригестрированы! Теперь войдите в аккаунт.</div> : "" : ""}
                        {regNameErr && regNameDirty ? <div className="error-msg">{regNameErr}</div> : null}
                        <input autocomplete="off" value={regName} onChange={e => regNameHandler(e)} className={regNameErr && regNameDirty ? "error-input" : ""} onBlur={e => blurRegHandler(e)} type="text" placeholder="Имя" name="name"/>

                        {regPasswordDirty && regPasswordErr ? <div className="error-msg">{regPasswordErr}</div> : null}
                        <input value={regPassword} onChange={e => regPasswordHandler(e)} className={regPasswordDirty && regPasswordErr ? "error-input" : ""} onBlur={e => blurRegHandler(e)} type="password" placeholder="Пароль" name="password"/>

                        {regRepeatDirty && regRepeatErr ? <div className="error-msg">{regRepeatErr}</div> : null}
                        <input value={regRepeat} onChange={e => regRepeatHandler(e)} className={regRepeatDirty && regRepeatErr ? "error-input" : ""} onBlur={e => blurRegHandler(e)} type="password" placeholder="Повторите пароль" name="repeate"/>

                        <button disabled={regNameErr || regPasswordErr || regRepeatErr ? true : false}>Создать</button>
                        <p className="message">Уже зарегистрированы? <span>Войти</span></p>
                    </form>
                    <form className="login-form" onSubmit={e => logIn(e)}>
                        {logNameErr && logNameDirty ? <div className="error-msg">{logNameErr}</div> : null}
                        <input autocomplete="off" className={logNameErr && logNameDirty ? "error-input" : ""} onBlur={e => blurLogHandler(e)} value={logName} onChange={e => logNameHandler(e)} type="text" placeholder="Имя" name="name"/>

                        {logPasswordDirty && logPasswordErr ? <div className="error-msg">{logPasswordErr}</div> : null}
                        <input className={logPasswordDirty && logPasswordErr ? "error-input" : ""} onBlur={e => blurLogHandler(e)} value={logPassword} onChange={e => logPasswordHandler(e)} type="password" placeholder="Пароль" name="password"/>
                        <button disabled={logName.length < 3 || logName.length > 24 || logPassword.length < 8 || logPassword.length > 42 ? true : false}>Войти</button>
                        <p className="message">Не зарегистрированы? <span>Создать аккаунт</span></p>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}
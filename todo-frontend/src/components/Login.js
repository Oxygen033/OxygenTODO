import React, { useContext, useEffect, useState, useHistory } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/Login.css";

function Login()
{
    const {Login, Register, username} = useContext(AuthContext);
    const navigate = useNavigate();

    const [loginUsername, setLoginUsername] = useState(); 
    const [loginPassword, setLoginPassword] = useState();

    const [regUsername, setRegUsername] = useState(); 
    const [regPassword, setRegPassword] = useState();

    const [errorMessage, setErrorMessage] = useState();

    async function handleLogin(username, password)
    {
        if(! (await Login(username, password).then()))
        {
            setErrorMessage('Invalid login of password');
        }
        else
        {
            setErrorMessage('');
            navigate('/');
        }
    }

    async function handleRegister(username, password)
    {
        if(!(await Register(username, password).then()))
        {
            setErrorMessage('Error occured, try again');
        }
        else
        {
            setErrorMessage('Successfully registered, now you can login');
        }
    }

    return(
        <div className="auth-forms-container">
            <h2>Войти:</h2>
            <form className="login-form">
                <div className="input-block">
                    <label for="login-username" className="label-default">Имя пользователя:</label>
                    <input type="text" id="login-username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)}/>
                </div>
                <div className="input-block">
                    <label for="login-password" className="label-default">Пароль:</label>
                    <input type="password" id="login-password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}/>
                </div>
                <div>
                    <button className="login-button" type="button" onClick={() => handleLogin(loginUsername, loginPassword)}>ВОЙТИ</button>
                </div>
            </form>
            <h2>Или зарегистрироваться:</h2>
            <form className="login-form">
                <div className="input-block">
                    <label for="reg-username" className="label-default">Имя пользователя:</label>
                    <input type="text" id="reg-username" value={regUsername} onChange={e => setRegUsername(e.target.value)}/>
                </div>
                <div className="input-block">
                    <label for="reg-password" className="label-default">Пароль:</label>
                    <input type="password" id="reg-password" value={regPassword} onChange={e => setRegPassword(e.target.value)}/>
                </div>
                <div>
                    <button className="login-button" type="button" onClick={() => handleRegister(regUsername, regPassword)}>РЕГИСТРАЦИЯ</button>
                </div>
            </form>
            <p className="error-message">{errorMessage}</p>
        </div>
    );
}

export default Login;
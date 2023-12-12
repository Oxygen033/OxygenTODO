import React, {createContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [currentUsername, setCurrentUsername] = useState();
  const [tokenExpiry, setTokenExpiry] = useState(null);

  useEffect(() => {
    const storedExpiry = localStorage.getItem('AuthTokenExpiry');
    const storedToken = localStorage.getItem('AuthToken');
    if (storedToken !== null && storedExpiry !== null) 
    {
      setToken(storedToken);
      setTokenExpiry(storedExpiry);
    }
  }, []);

  useEffect(() => {
    if (tokenExpiry) 
    {
      const currentTime = new Date().getTime();
      if (currentTime > tokenExpiry) 
      {
        Logout();
      }
    }
  }, [tokenExpiry]);

  function CalculateTokenExpiry() 
  {
    const currentTimestamp = new Date().getTime();
    const expirationTime = 3600;
    const expirationTimestamp = currentTimestamp + expirationTime * 1000;
    return expirationTimestamp;
  }

  function checkAuth()
  {
    return !!token; 
  }

  async function Login(username, password)
  {
    const response = await fetch('http://localhost:3010/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: "cors",
      body: JSON.stringify({ username, password })  
    });
    
    if (response.ok) 
    {
      const token = response.headers.get('Authorization');
      console.log('Token is: ' + response.headers.get('Authorization'));
      for (const pair of response.headers.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const expiry = CalculateTokenExpiry();
      setToken(token);
      setTokenExpiry(expiry);
      localStorage.setItem('AuthToken', token);
      localStorage.setItem('AuthTokenExpiry', expiry);
      console.log('token saved to localstorage as ' + localStorage.getItem('AuthToken'));
      setCurrentUsername(username);
      return true;
    } else 
    {
      return false;
    }
  }

  async function Register(username, password)
  {
    const response = await fetch('http://localhost:3010/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })  
    });
    
    if (response.ok) 
    {
      return true;
    } else 
    {
      return false;
    }
  }

  function Logout()
  {
    setToken(null);
    localStorage.removeItem('AuthToken');
  }

  const value = {
    token,
    currentUsername,
    Login,
    Logout,
    checkAuth,
    Register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>  
  );
};
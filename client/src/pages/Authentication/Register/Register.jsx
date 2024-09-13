import React, { useEffect, useState } from 'react'
import "../Authentication.css"
import { useBlogContext } from '../../../context/ContextContainer'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const { api, token, setToken,getToken } = useBlogContext()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  })
 
  const navigate = useNavigate()



  useEffect(()=> {
    if (token) {
      navigate("/")
      getToken()
    }
  },[token])
  const onChangeMethod = (e) => {
    const name = e.target.name
    const value = e.target.value
    setUserData({ ...userData, [name]: value })
  }
  // console.log(userData)

  const onSubmitHanler = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/api/register", userData)
      // console.log(response)
      if (response.data.success) {
        setToken(true)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }


  }
  return (
    <>
     {token ? <span class="loader"></span> : (<form className='register' onSubmit={onSubmitHanler}>
        <h1>Register</h1>
        <input type="text"
          placeholder='username'
          name='username'
          onChange={onChangeMethod} />
        <input type="text"
          placeholder='Email'
          name='email'
          value={userData.email}
          onChange={onChangeMethod} />
        <input type="password"
          placeholder='password'
          name='password'
          value={userData.password}
          onChange={onChangeMethod} />
        <button type='submit'>Regiter</button>
      </form>)}
    </>
  )
}

export default Register
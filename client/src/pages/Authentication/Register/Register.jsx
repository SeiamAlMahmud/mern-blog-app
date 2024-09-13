import React, { useState } from 'react'
import "../Authentication.css"
import { useBlogContext } from '../../../context/ContextContainer'

const Register = () => {
  const { api } = useBlogContext()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const onChangeMethod = (e) => {
    const name = e.target.name
    const value = e.target.value
    setUserData({ ...userData, [name]: value })
  }
  console.log(userData)

  const onSubmitHanler = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/api/register", userData)
      console.log(response)
    } catch (error) {
      console.log(error)
    }


  }
  return (
    <>
      <form className='register' onSubmit={onSubmitHanler}>
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
      </form>
    </>
  )
}

export default Register
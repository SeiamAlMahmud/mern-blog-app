import React, { useState } from 'react'
import "../Authentication.css"
import { useBlogContext } from '../../../context/ContextContainer'

const Login = () => {
  const { api } = useBlogContext()
  const [userData, setUserData] = useState({
    username: "",
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
      const response = await api.post("/api/login", userData)
      console.log(response)
    } catch (error) {
      console.log(error)
    }


  }
  return (
    <>
      <form className='login' onSubmit={onSubmitHanler}>
        <h1>Login</h1>
        <input type="text"
          placeholder='username'
          name='username'
          onChange={onChangeMethod} />
        <input type="password"
          placeholder='password'
          name='password'
          value={userData.password}
          onChange={onChangeMethod} />
        <button type='submit'>Login</button>
      </form>
    </>
  )
}

export default Login
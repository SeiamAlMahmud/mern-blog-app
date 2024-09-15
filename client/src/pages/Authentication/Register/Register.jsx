import React, { useEffect, useState } from 'react'
import "../Authentication.css"
import { useBlogContext } from '../../../context/ContextContainer'
import { useNavigate } from 'react-router-dom'
import 'ldrs/pinwheel'

const Register = () => {
  const { api, token, setToken,getToken } = useBlogContext()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
 
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
    setLoading(true)
    try {
      const response = await api.post("/api/register", userData)
      // console.log(response)
      if (response.data.success) {
        setToken(true)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }


  }
  return (
    <>
     {token ? <span class="loader"></span> : (<form className='register' onSubmit={onSubmitHanler}>
        <h1>Register</h1>
        <input type="text"
          placeholder='username'
          name='username'
          onChange={onChangeMethod}
          required />
        <input type="text"
          placeholder='Email'
          name='email'
          value={userData.email}
          onChange={onChangeMethod}
          required />
        <input type="password"
          placeholder='password'
          name='password'
          value={userData.password}
          onChange={onChangeMethod}
          required />
        <button type='submit'
         disabled={loading}
         style={{backgroundColor: loading && '#d83a3a' }}
         >{loading ? <l-pinwheel
          size="18"
          stroke="3.5"
          speed="0.9"
          color="white"
        ></l-pinwheel> : "Register"}</button>
      </form>)}
    </>
  )
}

export default Register
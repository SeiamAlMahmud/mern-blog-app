import React, { useEffect, useState } from 'react'
import "../Authentication.css"
import { useBlogContext } from '../../../context/ContextContainer'
import { useLocation, useNavigate } from "react-router-dom"
import Loader from '../../../foundation/Loader/Loader'
import 'ldrs/pinwheel'
import toast from 'react-hot-toast'




const Login = () => {
  const { api, token, setToken, getToken } = useBlogContext()
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const from = location?.state?.from || "/"

  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate("/")
      getToken()
    }
  }, [token])
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
      const response = await api.post("/api/login", userData)
      // console.log(response)
      if (response.data.success) {
        setToken(true)
        navigate(from)
      }

    } catch (error) {
      console.log(error)
      if (error.response) {
        if (!error.response?.data?.success) {
          toast.error(error.response?.data?.error)
        }
      }
    } finally {
      setLoading(false)
    }


  }
  return (
    <>
      {token ? <Loader /> : (<form className='login' onSubmit={onSubmitHanler}>
        <h1>Login</h1>
        <input type="text"
          placeholder='username'
          name='username'
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
          style={{ backgroundColor: loading && '#d83a3a' }}
        >{loading ? <l-pinwheel
          size="18"
          stroke="3.5"
          speed="0.9"
          color="white"
        ></l-pinwheel> : "Login"}</button>
      </form>)}
    </>
  )
}

export default Login
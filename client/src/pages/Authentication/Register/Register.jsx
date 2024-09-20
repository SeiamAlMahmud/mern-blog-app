import React, { useEffect, useState } from 'react'
import "../Authentication.css"
import { useBlogContext } from '../../../context/ContextContainer'
import { Link, useNavigate } from 'react-router-dom'
import 'ldrs/pinwheel'
import toast from 'react-hot-toast'
import CircularIndeterminate from '../../../foundation/Loader/CircularIndeterminate'
import { RiLockPasswordFill } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";


const Register = () => {
  const { api, token, setToken, getToken } = useBlogContext()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [togglepas, setTogglePas] = useState(false)
  const [toggleConPas, setToggleConPas] = useState(false)


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
  console.log(userData)

  const onSubmitHanler = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (userData.password !== userData.confirmPassword) {
      return toast.error("Password didn't match.")
    }
    try {
      const response = await api.post("/api/register", userData)
      // console.log(response)
      if (response.data.success) {
        setToken(true)
        navigate('/')
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
      {token ? <span class="loader"></span> : (<form className='register' onSubmit={onSubmitHanler}>
        <h1>Register</h1>
        <input type="text"
          placeholder='username'
          name='username'
          onChange={onChangeMethod}
          required />
        <input type="email"
          placeholder='Email'
          name='email'
          value={userData.email}
          onChange={onChangeMethod}
          required />
        <div className='gender-selection'>
          <label htmlFor="genderMale" >
            <input
              type="checkbox"
              name="gender"
              value="Male"
              id="genderMale"
              checked={userData.gender == 'Male'}
              onChange={onChangeMethod}
               />
            Male
          </label>
          <label htmlFor="genderFemale" style={{ display: "flex" }}>
            <input
              type="checkbox"
              name="gender"
              id="genderFemale"
              value='Female'
              checked={userData.gender == 'Female'}
              onChange={onChangeMethod}
               />
            Female
          </label>
        </div>
        <div className='password_toggle'>
          <i><RiLockPasswordFill /></i>
          <i onClick={() => setTogglePas(prev => !prev)}>{togglepas ? <IoEye /> : <IoEyeOffSharp />}</i>
          <input type={togglepas ? "text" : "password"}
            placeholder='password'
            name='password'
            value={userData.password}
            onChange={onChangeMethod}
            required />
        </div>
        <div className='password_toggle'>
          <i><RiLockPasswordFill /></i>
          <i onClick={() => setToggleConPas(prev => !prev)}>{togglepas ? <IoEye /> : <IoEyeOffSharp />}</i>
          <input type={toggleConPas ? "text" : "password"}
            placeholder='Confirm password'
            name='confirmPassword'
            value={userData.confirmPassword}
            onChange={onChangeMethod}
            required />
        </div>
        <div className='have_an_account'>
          <p>Don't have an account? <Link to={"/login"}>Sign In</Link></p>
        </div>

        <button type='submit'
          disabled={loading}
          style={{ backgroundColor: loading && '#d83a3a', textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}
        >{loading ? <CircularIndeterminate /> : "Register"}</button>
      </form>)}
    </>
  )
}

export default Register
import React from 'react'
import "../Authentication.css"

const Register = () => {
  return (
    <>
  <form className='register'>
    <h1>Register</h1>
    <input type="text" placeholder='username' />
    <input type="text" placeholder='Email' />
    <input type="pasword" placeholder='password' />
    <button type='submit'>Regiter</button>
  </form>
    </>
  )
}

export default Register
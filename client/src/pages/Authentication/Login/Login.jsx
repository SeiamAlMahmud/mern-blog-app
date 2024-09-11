import React from 'react'
import "../Authentication.css"

const Login = () => {
  return (
    <>
     <form className='login'>
      <h1>Login</h1>
    <input type="text" placeholder='username' />
    <input type="pasword" placeholder='password' />
    <button type='submit'>Login</button>
  </form>
    </>
  )
}

export default Login